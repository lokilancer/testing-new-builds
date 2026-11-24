// Virtual labs for Grade 11 Science, Part I. Simplified, original models: Labs.<id> = (root, preset) => ({ state, destroy }).
const Labs = {};
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#888';
const sw = (hex, name) => `<span class="sw" style="background:${hex}"></span>${name}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fx = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toFixed(d);
const segs = (items, cur) => `<div class="segs" role="tablist">${items.map(([id, en, ta]) => `<button role="tab" data-seg="${id}" class="${id === cur ? 'on' : ''}" aria-selected="${id === cur}">${T(en, ta)}</button>`).join('')}</div>`;
// HiDPI canvas; returns { c, g, w, h, pos(e) } with coordinates in logical pixels
function canvas(root, w, h, label){
  const c = document.createElement('canvas'), d = Math.max(1.5, Math.min(2, window.devicePixelRatio || 1)); c.className = 'simcv'; c.width = w * d; c.height = h * d; c.setAttribute('aria-label', label || ''); root.appendChild(c);
  const g = c.getContext && c.getContext('2d'); if(g) g.setTransform(d, 0, 0, d, 0, 0);
  const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * w / (r.width || w), (e.clientY - r.top) * h / (r.height || h)]; };
  return { c, g, w, h, pos };
}
function arrow(g, x1, y1, x2, y2, col, lw = 3, dash){
  g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw; if(dash) g.setLineDash(dash); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.setLineDash([]);
  const a = Math.atan2(y2 - y1, x2 - x1), s = 9 + lw; g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - s * Math.cos(a - .4), y2 - s * Math.sin(a - .4)); g.lineTo(x2 - s * Math.cos(a + .4), y2 - s * Math.sin(a + .4)); g.closePath(); g.fill(); g.restore();
}
// Simple graph. o = { xmin,xmax,ymin,ymax,xlabel,ylabel,pts:[[x,y]],line,joined }
function plot(cv, o){
  const c = cv.getContext && cv.getContext('2d'); if(!c) return; const W = cv.width, H = cv.height, L = 56, B = 40, Tm = 14, Rm = 16;
  const ink = cssv('--ink'), line = cssv('--line'), muted = cssv('--muted'), green = cssv('--green'), amber = cssv('--amber');
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.fillStyle = cssv('--paper'); c.fillRect(0, 0, W, H);
  const X = x => L + (x - o.xmin) / (o.xmax - o.xmin) * (W - L - Rm), Y = y => H - B - (y - o.ymin) / (o.ymax - o.ymin) * (H - B - Tm); c.font = '12px sans-serif'; c.lineWidth = 1;
  for(let i = 0; i <= 5; i++){ const x = o.xmin + (o.xmax - o.xmin) * i / 5, y = o.ymin + (o.ymax - o.ymin) * i / 5; c.strokeStyle = line; c.beginPath(); c.moveTo(X(x), Tm); c.lineTo(X(x), H - B); c.moveTo(L, Y(y)); c.lineTo(W - Rm, Y(y)); c.stroke();
    c.fillStyle = muted; c.textAlign = 'center'; c.fillText(+x.toFixed(2), X(x), H - B + 15); c.textAlign = 'right'; c.fillText(+y.toFixed(1), L - 6, Y(y) + 4); }
  c.strokeStyle = ink; c.lineWidth = 1.6; c.beginPath(); c.moveTo(L, Tm); c.lineTo(L, H - B); c.lineTo(W - Rm, H - B); c.stroke(); if(o.ymin < 0){ c.beginPath(); c.moveTo(L, Y(0)); c.lineTo(W - Rm, Y(0)); c.stroke(); }
  c.fillStyle = ink; c.textAlign = 'center'; c.fillText(o.xlabel, (L + W - Rm) / 2, H - 6); c.save(); c.translate(14, (Tm + H - B) / 2); c.rotate(-Math.PI / 2); c.fillText(o.ylabel, 0, 0); c.restore();
  if(o.line){ c.strokeStyle = green; c.lineWidth = 2.4; c.beginPath(); c.moveTo(X(o.line[0][0]), Y(o.line[0][1])); c.lineTo(X(o.line[1][0]), Y(o.line[1][1])); c.stroke(); }
  if(o.joined && o.pts.length > 1){ c.strokeStyle = green; c.lineWidth = 2; c.beginPath(); o.pts.forEach(([x, y], i) => i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))); c.stroke(); }
  (o.extra || []).forEach(e => { c.strokeStyle = e.color; c.lineWidth = 2.2; c.beginPath(); e.pts.forEach(([x, y], i) => i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))); c.stroke(); if(e.label){ const p = e.pts[e.pts.length - 1]; c.fillStyle = e.color; c.textAlign = 'right'; c.fillText(e.label, X(p[0]) - 6, Y(p[1]) - 8); } });
  o.pts.forEach(([x, y]) => { c.fillStyle = amber; c.strokeStyle = ink; c.lineWidth = 1.5; c.beginPath(); c.arc(X(x), Y(y), 5, 0, 7); c.fill(); c.stroke(); });
  if(o.mark){ c.fillStyle = '#e53935'; c.strokeStyle = ink; c.lineWidth = 2; c.beginPath(); c.arc(X(o.mark[0]), Y(o.mark[1]), 7, 0, 7); c.fill(); c.stroke(); }
}

// ================= Optics: mirrors, lenses and the glass block (Unit 5) =================
Labs.optics = (root, pre = {}) => {
  const W = 760, H = 380, CX = 380, CY = 190, S = 6;
  const DEV = { cm: { n: T('Concave mirror', 'குழிவு ஆடி'), mirror: 1, sg: 1 }, vm: { n: T('Convex mirror', 'குவிவு ஆடி'), mirror: 1, sg: -1 }, cl: { n: T('Convex lens', 'குவிவு வில்லை'), mirror: 0, sg: 1 }, vl: { n: T('Concave lens', 'குழிவு வில்லை'), mirror: 0, sg: -1 } };
  const st = { tab: pre.tab || 'mirror', dev: pre.dev || 'cm', f: 10, u: clamp(pre.u || 24, 4, 60), hgt: 4, ang: 40, n: 1.5, show: true, drag: false };
  root.innerHTML = `<div id="opTabs">${segs([['mirror', 'Mirrors and lenses', 'ஆடிகளும் வில்லைகளும்'], ['block', 'Glass block', 'கண்ணாடிக் குற்றி']], st.tab)}</div><div id="opBody"></div>`;
  const body = root.querySelector('#opBody'); let cv = null;
  function build(){
    body.innerHTML = '';
    if(st.tab === 'mirror'){
      body.innerHTML = `<div class="simbar">${segs(Object.entries(DEV).map(([k, d]) => [k, d.n, d.n]), st.dev).replace(/<button/g, '<button data-dev')}</div><div class="simbar"><label>${T('Focal length (cm)', 'குவியத்தூரம் (cm)')} <b id="opFv">${st.f}</b><input type="range" id="opF" min="5" max="20" step="1" value="${st.f}"></label><label>${T('Object distance (cm)', 'பொருளின் தூரம் (cm)')} <b id="opUv">${st.u}</b><input type="range" id="opU" min="4" max="60" step="1" value="${st.u}"></label></div><div class="readout" id="opRead"></div><p class="status" id="opNote" role="status"></p>`;
      body.querySelectorAll('[data-dev]').forEach(b => b.onclick = () => { st.dev = b.dataset.seg; body.querySelectorAll('[data-dev]').forEach(x => x.classList.toggle('on', x === b)); draw(); });
      const set = (id, k, vid) => body.querySelector(id).oninput = e => { st[k] = +e.target.value; body.querySelector(vid).textContent = st[k]; draw(); }; set('#opF', 'f', '#opFv'); set('#opU', 'u', '#opUv');
    } else {
      body.innerHTML = `<div class="simbar"><label>${T('Angle of incidence i (°)', 'படுகோணம் i (°)')} <b id="opIv">${st.ang}</b><input type="range" id="opI" min="0" max="80" step="1" value="${st.ang}"></label><label>${T('Refractive index n', 'முறிவுச் சுட்டி n')} <b id="opNv">${st.n.toFixed(2)}</b><input type="range" id="opN" min="1.2" max="2" step="0.01" value="${st.n}"></label><label class="chk"><input type="checkbox" id="opS" ${st.show ? 'checked' : ''}> ${T('Show the angle values', 'கோண மதிப்புகளைக் காட்டுக')}</label></div><div class="readout" id="opRead"></div><p class="status" id="opNote" role="status"></p>`;
      body.querySelector('#opI').oninput = e => { st.ang = +e.target.value; body.querySelector('#opIv').textContent = st.ang; draw(); }; body.querySelector('#opN').oninput = e => { st.n = +e.target.value; body.querySelector('#opNv').textContent = st.n.toFixed(2); draw(); }; body.querySelector('#opS').onchange = e => { st.show = e.target.checked; draw(); };
    }
    cv = canvas(body, W, H, T('Ray diagram', 'கதிர் வரைபடம்')); body.insertBefore(cv.c, body.querySelector('.readout')); draw();
    if(st.tab === 'mirror'){ cv.c.onpointerdown = e => { const [x] = cv.pos(e); if(Math.abs(x - (CX - st.u * S)) < 40){ st.drag = true; try{ cv.c.setPointerCapture(e.pointerId); }catch(z){} } }; cv.c.onpointermove = e => { if(st.drag){ st.u = Math.round(clamp((CX - cv.pos(e)[0]) / S, 4, 60)); body.querySelector('#opU').value = st.u; body.querySelector('#opUv').textContent = st.u; draw(); } }; cv.c.onpointerup = cv.c.onpointercancel = () => { st.drag = false; }; }
  }
  const P = (x, y) => [CX + x * S, CY - y * S];
  function line(g, a, b, col, lw = 2, dash){ g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash || []); g.beginPath(); g.moveTo(...P(...a)); g.lineTo(...P(...b)); g.stroke(); g.setLineDash([]); }
  function calc(){
    const d = DEV[st.dev], ff = d.sg * st.f, u = st.u, den = 1 / ff - 1 / u, inf = Math.abs(den) < 1e-9, v = inf ? Infinity : 1 / den, m = inf ? Infinity : -v / u;
    return { d, ff, u, v, m, inf, Ix: inf ? NaN : (d.mirror ? -v : v), Iy: inf ? NaN : m * st.hgt, real: !inf && v > 0 };
  }
  function drawMirrorLens(){
    const g = cv.g, r = calc(), h = st.hgt, ink = cssv('--ink'), muted = cssv('--muted'); g.clearRect(0, 0, W, H); g.fillStyle = cssv('--paper'); g.fillRect(0, 0, W, H);
    g.strokeStyle = cssv('--line'); g.lineWidth = 1; g.beginPath(); g.moveTo(0, CY + .5); g.lineTo(W, CY + .5); g.stroke();
    const fpx = st.f * S; g.lineWidth = 4; g.strokeStyle = ink; g.beginPath();
    if(r.d.mirror){ for(let y = -105; y <= 105; y += 3){ const x = CX + (r.d.sg > 0 ? -1 : 1) * y * y / (4 * fpx); y === -105 ? g.moveTo(x, CY + y) : g.lineTo(x, CY + y); } g.stroke(); g.lineWidth = 1.5; for(let y = -105; y <= 105; y += 15){ const x = CX + (r.d.sg > 0 ? -1 : 1) * y * y / (4 * fpx); g.beginPath(); g.moveTo(x, CY + y); g.lineTo(x + 10, CY + y + 8); g.stroke(); } }
    else { g.lineWidth = 3; const hh = 120, bulge = r.d.sg > 0 ? 16 : -10; g.beginPath(); g.moveTo(CX, CY - hh); g.quadraticCurveTo(CX + bulge * 2, CY, CX, CY + hh); g.quadraticCurveTo(CX - bulge * 2, CY, CX, CY - hh); g.fillStyle = 'rgba(120,190,230,.28)'; g.fill(); g.stroke(); arrow(g, CX, CY - hh - 2, CX, CY - hh - 2, ink, 1); }
    g.fillStyle = muted; g.font = '12px sans-serif'; g.textAlign = 'center'; const fpts = r.d.mirror ? [-r.ff, -2 * r.ff] : [r.ff, -r.ff, 2 * r.ff, -2 * r.ff];
    fpts.forEach((x, i) => { const [px, py] = P(x, 0); g.beginPath(); g.arc(px, py, 3.5, 0, 7); g.fill(); g.fillText(r.d.mirror ? (i ? 'C' : 'F') : (Math.abs(x) === Math.abs(r.ff) ? 'F' : '2F'), px, py + 18); });
    const A = [-r.u, h], P1 = [0, h], P2 = [0, 0], P3 = Math.abs(r.ff - r.u) > 0.15 ? [0, h * r.ff / (r.ff - r.u)] : null, cols = ['#e53935', '#1e88e5', '#2e9d4f'];
    [P1, P2, P3].forEach((p, i) => { if(p) line(g, A, p, cols[i], 2); });
    const out = (p, i) => { let dir; if(r.inf){ dir = r.d.mirror ? [-r.u, -h] : [r.u, -h]; } else { const I = [r.Ix, r.Iy]; dir = r.real ? [I[0] - p[0], I[1] - p[1]] : [p[0] - I[0], p[1] - I[1]]; } const n = Math.hypot(...dir) || 1; dir = [dir[0] / n, dir[1] / n]; const E = [p[0] + dir[0] * 80, p[1] + dir[1] * 80]; line(g, p, E, cols[i], 2); if(!r.inf && !r.real) line(g, p, [r.Ix, r.Iy], cols[i], 1.5, [5, 5]); };
    [P1, P2, P3].forEach((p, i) => { if(p) out(p, i); });
    arrow(g, ...P(-r.u, 0), ...P(-r.u, h), '#d98e00', 5); g.fillStyle = '#d98e00'; g.textAlign = 'center'; g.fillText(T('object', 'பொருள்'), ...P(-r.u, -1.2));
    if(!r.inf && Math.abs(r.Iy) < 60 && Math.abs(r.Ix) < 62) { arrow(g, ...P(r.Ix, 0), ...P(r.Ix, r.Iy), '#8e44ad', 5, r.real ? null : [6, 5]); g.fillStyle = '#8e44ad'; g.fillText(T('image', 'விம்பம்'), P(r.Ix, 0)[0], P(r.Ix, r.Iy < 0 ? -r.Iy * .0 + 1.4 : -1.4)[1] + (r.Iy < 0 ? -r.Iy * S * 0 : 0)); }
    g.fillStyle = muted; g.textAlign = 'left'; g.fillText(T('Drag the object', 'பொருளை இழுக்க') + ' ◀ ▶', 12, 20);
    const rd = body.querySelector('#opRead'), nat = r.inf ? T('Image at infinity: the rays leave parallel.', 'விம்பம் முடிவிலியில்: கதிர்கள் சமாந்தரமாகச் செல்கின்றன.') : `${r.real ? T('Real', 'உண்மை') : T('Virtual', 'மாய')} · ${r.m < 0 ? T('inverted', 'தலைகீழ்') : T('upright', 'நிமிர்ந்த')} · ${Math.abs(r.m) > 1.05 ? T('magnified', 'பெரிதாக்கப்பட்ட') : Math.abs(r.m) < 0.95 ? T('diminished', 'சிறிதாக்கப்பட்ட') : T('same size', 'சம அளவு')}`;
    rd.innerHTML = `<div><b>${fx(r.u, 0)}</b><span>${T('object distance u (cm)', 'பொருள் தூரம் u (cm)')}</span></div><div><b>${r.inf ? '∞' : fx(Math.abs(r.v))}</b><span>${T('image distance v (cm)', 'விம்ப தூரம் v (cm)')}</span></div><div><b>${r.inf ? '∞' : fx(Math.abs(r.m), 2)}</b><span>${T('magnification', 'உருப்பெருக்கம்')}</span></div>`;
    body.querySelector('#opNote').textContent = nat; return r;
  }
  function drawBlock(){
    const g = cv.g, i = st.ang * Math.PI / 180, sr = Math.sin(i) / st.n, rr = Math.asin(sr), Wd = 320, T0 = 130, x0 = CX - Wd / 2, y0 = CY - T0 / 2, Q = [CX - 20, y0];
    g.clearRect(0, 0, W, H); g.fillStyle = cssv('--paper'); g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(120,190,230,.35)'; g.strokeStyle = cssv('--ink'); g.lineWidth = 2; g.fillRect(x0, y0, Wd, T0); g.strokeRect(x0, y0, Wd, T0);
    const E = [Q[0] + T0 * Math.tan(rr), y0 + T0], D = [Q[0] + T0 * Math.tan(i), y0 + T0], src = [Q[0] - 190 * Math.sin(i), Q[1] - 190 * Math.cos(i)], end = [E[0] + 190 * Math.sin(i), E[1] + 190 * Math.cos(i)];
    g.setLineDash([6, 5]); g.strokeStyle = cssv('--muted'); g.lineWidth = 1.3; [[Q[0], Q[1] - 130, Q[0], Q[1] + 60], [E[0], E[1] - 60, E[0], E[1] + 130]].forEach(l => { g.beginPath(); g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); g.stroke(); }); g.strokeStyle = '#d98e00'; g.beginPath(); g.moveTo(Q[0], Q[1]); g.lineTo(D[0], D[1]); g.stroke(); g.setLineDash([]);
    g.strokeStyle = '#e53935'; g.lineWidth = 3; g.beginPath(); g.moveTo(...src); g.lineTo(...Q); g.stroke(); g.strokeStyle = '#2e9d4f'; g.beginPath(); g.moveTo(...Q); g.lineTo(...E); g.stroke(); g.strokeStyle = '#e53935'; g.beginPath(); g.moveTo(...E); g.lineTo(...end); g.stroke();
    g.fillStyle = cssv('--ink'); g.font = '14px sans-serif'; g.textAlign = 'center'; g.fillText(T('glass block', 'கண்ணாடிக் குற்றி'), CX, y0 + T0 + 22); g.fillText(T('normal', 'செவ்வன்'), Q[0] + 28, Q[1] - 112);
    if(st.show){ g.fillText(`i = ${fx(st.ang, 0)}°`, Q[0] - 52, Q[1] - 26); g.fillText(`r = ${fx(rr * 180 / Math.PI)}°`, Q[0] + 36, Q[1] + 44); } else { g.fillText('i', Q[0] - 40, Q[1] - 26); g.fillText('r', Q[0] + 30, Q[1] + 44); }
    const shift = T0 * (Math.tan(i) - Math.tan(rr)) * Math.cos(i) / 10;
    body.querySelector('#opRead').innerHTML = `<div><b>${fx(st.ang, 0)}°</b><span>${T('angle of incidence i', 'படுகோணம் i')}</span></div><div><b>${st.show ? fx(rr * 180 / Math.PI) + '°' : '?'}</b><span>${T('angle of refraction r', 'முறிவுக் கோணம் r')}</span></div><div><b>${st.show && st.ang > 0 ? fx(Math.sin(i) / Math.sin(rr), 2) : '?'}</b><span>sin i ÷ sin r</span></div><div><b>${fx(shift, 2)}</b><span>${T('sideways shift (cm)', 'பக்கவாட்டு இடப்பெயர்ச்சி (cm)')}</span></div>`;
    body.querySelector('#opNote').textContent = T('The emergent ray is parallel to the incident ray, but shifted sideways.', 'வெளிவரும் கதிர் படுகதிருக்குச் சமாந்தரம்; ஆனால் பக்கவாட்டில் இடம்பெயர்ந்துள்ளது.');
  }
  function draw(){ if(!cv || !cv.g) return; return st.tab === 'mirror' ? drawMirrorLens() : drawBlock(); }
  root.querySelector('#opTabs').onclick = e => { const b = e.target.closest('[data-seg]'); if(!b) return; st.tab = b.dataset.seg; root.querySelectorAll('#opTabs [data-seg]').forEach(x => x.classList.toggle('on', x === b)); build(); };
  build(); return { state: st, calc, destroy() {} };
};

// ================= Waves and sound (Unit 4) =================
Labs.waves = (root, pre = {}) => {
  const W = 760, H = 300, PXCM = 4, N = 96, X0 = 40, DX = 7.2;
  const st = { tab: pre.tab || 'wave', type: pre.type || 'transverse', amp: 30, freq: 0.8, wl: 160, ribbons: !!pre.ribbons, run: true, t: 0, raf: 0, last: 0, L: 18, ampS: 5, rows: [], ph: 0 };
  root.innerHTML = `<div id="wvTabs">${segs([['wave', 'Slinky waves', 'சிலிங்கி அலைகள்'], ['sound', 'Sound and pitch', 'ஒலியும் சுருதியும்']], st.tab)}</div><div id="wvBody"></div>`;
  const body = root.querySelector('#wvBody'); let cv = null, actx = null, osc = null;
  const stopTone = () => { try{ osc && osc.stop(); }catch(e){} osc = null; };
  function build(){
    stopTone(); body.innerHTML = '';
    if(st.tab === 'wave'){
      body.innerHTML = `<div class="simbar">${segs([['transverse', 'Transverse', 'குறுக்கு அலை'], ['longitudinal', 'Longitudinal', 'நெட்டாங்கு அலை']], st.type).replace(/<button/g, '<button data-type')}<label class="chk"><input type="checkbox" id="wvR" ${st.ribbons ? 'checked' : ''}> ${T('Coloured ribbons', 'நிறமூட்டிய நாடாக்கள்')}</label><button class="btn ghost" id="wvP"></button></div>
      <div class="simbar"><label>${T('Amplitude', 'வீச்சம்')}<input type="range" id="wvA" min="10" max="60" value="${st.amp}"></label><label>${T('Frequency (Hz)', 'மீடிறன் (Hz)')} <b id="wvFv">${st.freq.toFixed(1)}</b><input type="range" id="wvF" min="0.2" max="2" step="0.1" value="${st.freq}"></label><label>${T('Wavelength (cm)', 'அலைநீளம் (cm)')} <b id="wvLv">${st.wl / PXCM}</b><input type="range" id="wvL" min="80" max="240" step="4" value="${st.wl}"></label></div>
      <div class="readout" id="wvRead"></div><p class="status" id="wvNote"></p>`;
      body.querySelectorAll('[data-type]').forEach(b => b.onclick = () => { st.type = b.dataset.seg; body.querySelectorAll('[data-type]').forEach(x => x.classList.toggle('on', x === b)); });
      body.querySelector('#wvR').onchange = e => { st.ribbons = e.target.checked; }; const P = () => body.querySelector('#wvP'); P().textContent = st.run ? T('Pause', 'நிறுத்து') : T('Play', 'இயக்கு'); P().onclick = () => { st.run = !st.run; P().textContent = st.run ? T('Pause', 'நிறுத்து') : T('Play', 'இயக்கு'); };
      body.querySelector('#wvA').oninput = e => { st.amp = +e.target.value; }; body.querySelector('#wvF').oninput = e => { st.freq = +e.target.value; body.querySelector('#wvFv').textContent = st.freq.toFixed(1); }; body.querySelector('#wvL').oninput = e => { st.wl = +e.target.value; body.querySelector('#wvLv').textContent = st.wl / PXCM; };
      cv = canvas(body, W, H, T('Wave on a slinky', 'சிலிங்கியில் அலை')); body.insertBefore(cv.c, body.querySelector('.readout'));
    } else {
      body.innerHTML = `<div class="simbar"><label>${T('Length of the vibrating blade (cm)', 'அதிரும் கத்தியின் நீளம் (cm)')} <b id="snLv">${st.L}</b><input type="range" id="snL" min="8" max="30" step="1" value="${st.L}"></label><label>${T('Loudness (amplitude)', 'ஒலி உரப்பு (வீச்சம்)')}<input type="range" id="snA" min="1" max="10" value="${st.ampS}"></label></div>
      <div class="simbar"><button class="btn" id="snPlay">${T('Play the sound', 'ஒலியை இயக்கு')}</button><button class="btn ghost" id="snRec">${T('Record', 'பதிவு செய்')}</button><button class="btn ghost" id="snClr">${T('Clear', 'அழி')}</button></div><div class="readout" id="snRead"></div><p class="status" id="snNote"></p>`;
      cv = canvas(body, W, 240, T('Vibrating blade', 'அதிரும் கத்தி')); body.insertBefore(cv.c, body.querySelector('.readout'));
      const g2 = canvas(body, 480, 300, T('Frequency against length', 'நீளத்துக்கு எதிரான மீடிறன்')); g2.c.id = 'snG'; g2.c.width = 480; g2.c.height = 300; st.gc = g2.c;
      body.querySelector('#snL').oninput = e => { st.L = +e.target.value; body.querySelector('#snLv').textContent = st.L; if(osc) osc.frequency.value = Math.max(30, freq()); }; body.querySelector('#snA').oninput = e => { st.ampS = +e.target.value; };
      body.querySelector('#snPlay').onclick = play; body.querySelector('#snRec').onclick = () => { st.rows = st.rows.filter(r => r.L !== st.L); st.rows.push({ L: st.L, f: freq() }); table(); }; body.querySelector('#snClr').onclick = () => { st.rows = []; table(); }; table();
    }
  }
  const freq = () => 15000 / (st.L * st.L);
  function play(){
    try{ const AC = window.AudioContext || window.webkitAudioContext; if(!AC) throw 0; actx = actx || new AC(); if(actx.state === 'suspended') actx.resume(); stopTone();
      osc = actx.createOscillator(); const g = actx.createGain(), t = actx.currentTime; osc.frequency.value = Math.max(30, freq()); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.04 + st.ampS * 0.03, t + .05); g.gain.setValueAtTime(0.04 + st.ampS * 0.03, t + 1.4); g.gain.linearRampToValueAtTime(0, t + 1.5); osc.connect(g); g.connect(actx.destination); osc.start(t); osc.stop(t + 1.5);
    }catch(e){ body.querySelector('#snNote').textContent = T('Sound is not available in this browser.', 'இந்த உலாவியில் ஒலி கிடைக்கவில்லை.'); }
  }
  function table(){ const s = [...st.rows].sort((a, b) => a.L - b.L); plot(st.gc, { xmin: 0, xmax: 32, ymin: 0, ymax: 260, xlabel: T('Length (cm)', 'நீளம் (cm)'), ylabel: T('Frequency (Hz)', 'மீடிறன் (Hz)'), pts: s.map(r => [r.L, r.f]), joined: true }); }
  function drawWave(){
    const g = cv.g, ink = cssv('--ink'), k = 2 * Math.PI / st.wl, w = 2 * Math.PI * st.freq, cy = 150; g.clearRect(0, 0, W, H); g.fillStyle = cssv('--paper'); g.fillRect(0, 0, W, H);
    g.strokeStyle = cssv('--line'); g.setLineDash([5, 5]); g.beginPath(); g.moveTo(X0, cy); g.lineTo(X0 + (N - 1) * DX, cy); g.stroke(); g.setLineDash([]);
    const rib = [18, 40, 62, 84], rc = ['#e53935', '#1e88e5', '#2e9d4f', '#8e44ad']; let mark = null;
    if(st.type === 'transverse'){
      g.strokeStyle = ink; g.lineWidth = 2.5; g.beginPath(); for(let i = 0; i < N; i++){ const x = X0 + i * DX, y = cy - st.amp * Math.sin(k * (i * DX) - w * st.t); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
      g.fillStyle = cssv('--green'); for(let i = 0; i < N; i += 2){ const x = X0 + i * DX; g.beginPath(); g.arc(x, cy - st.amp * Math.sin(k * i * DX - w * st.t), 3, 0, 7); g.fill(); }
      if(st.ribbons) rib.forEach((i, j) => { const x = X0 + i * DX, y = cy - st.amp * Math.sin(k * i * DX - w * st.t); g.strokeStyle = rc[j]; g.lineWidth = 1.5; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(x, cy - 70); g.lineTo(x, cy + 70); g.stroke(); g.setLineDash([]); g.fillStyle = rc[j]; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); });
      let p = Math.ceil((w * st.t + Math.PI / 2 - k * 60) / (2 * Math.PI)); const xc = (Math.PI / 2 + w * st.t + 2 * Math.PI * p) / k, x1 = X0 + xc, x2 = x1 + st.wl; mark = { x1, x2 };
      if(x2 < X0 + (N - 1) * DX){ g.strokeStyle = '#d98e00'; g.lineWidth = 2; g.beginPath(); g.moveTo(x1, cy - st.amp - 24); g.lineTo(x2, cy - st.amp - 24); g.moveTo(x1, cy - st.amp - 30); g.lineTo(x1, cy - st.amp - 18); g.moveTo(x2, cy - st.amp - 30); g.lineTo(x2, cy - st.amp - 18); g.stroke(); g.fillStyle = '#d98e00'; g.font = '14px sans-serif'; g.textAlign = 'center'; g.fillText('λ', (x1 + x2) / 2, cy - st.amp - 30); g.fillStyle = ink; g.fillText(T('crest', 'முடி'), x1, cy - st.amp - 38 + 6 - 20 + 38 - 6 - 18); }
      const xt = x1 + st.wl / 2; if(xt < X0 + (N - 1) * DX - 10){ g.fillStyle = ink; g.textAlign = 'center'; g.font = '13px sans-serif'; g.fillText(T('trough', 'தாழி'), xt, cy + st.amp + 22); }
    } else {
      const am = st.amp * 0.6; g.strokeStyle = ink; g.lineWidth = 2; for(let i = 0; i < N; i++){ const x = X0 + i * DX + am * Math.sin(k * i * DX - w * st.t); g.beginPath(); g.moveTo(x, cy - 46); g.lineTo(x, cy + 46); g.stroke(); }
      if(st.ribbons) rib.forEach((i, j) => { const x0 = X0 + i * DX, x = x0 + am * Math.sin(k * i * DX - w * st.t); g.strokeStyle = rc[j]; g.lineWidth = 1.5; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(x0, cy - 62); g.lineTo(x0, cy + 62); g.stroke(); g.setLineDash([]); g.fillStyle = rc[j]; g.beginPath(); g.arc(x, cy, 9, 0, 7); g.fill(); });
      let p = Math.ceil((w * st.t - Math.PI - k * 60) / (2 * Math.PI)); const xc = (Math.PI + w * st.t + 2 * Math.PI * p) / k, x1 = X0 + xc + 0, x2 = x1 + st.wl; mark = { x1, x2 };
      g.font = '13px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#d98e00'; if(x2 < X0 + (N - 1) * DX){ g.strokeStyle = '#d98e00'; g.lineWidth = 2; g.beginPath(); g.moveTo(x1, cy + 78); g.lineTo(x2, cy + 78); g.stroke(); g.fillText('λ', (x1 + x2) / 2, cy + 74); }
      g.fillStyle = ink; if(x1 < X0 + (N - 1) * DX - 10) g.fillText(T('compression', 'நெருக்கல்'), x1, cy - 58); const xr = x1 + st.wl / 2; if(xr < X0 + (N - 1) * DX - 10) g.fillText(T('rarefaction', 'ஐதாக்கம்'), xr, cy - 58);
    }
    g.fillStyle = cssv('--muted'); g.textAlign = 'left'; g.font = '13px sans-serif'; g.fillText(T('wave travels →', 'அலை செல்லும் திசை →'), 14, 22); g.fillText(st.type === 'transverse' ? T('particles move ↕ (at right angles)', 'துணிக்கைகள் ↕ அசைகின்றன (செங்குத்தாக)') : T('particles move ↔ (along the wave)', 'துணிக்கைகள் ↔ அசைகின்றன (அலையின் திசையில்)'), 14, 42);
    const lam = st.wl / PXCM; body.querySelector('#wvRead').innerHTML = `<div><b>${st.freq.toFixed(1)}</b><span>${T('frequency f (Hz)', 'மீடிறன் f (Hz)')}</span></div><div><b>${(1 / st.freq).toFixed(2)}</b><span>${T('period T (s)', 'ஆவர்த்தன காலம் T (s)')}</span></div><div><b>${lam}</b><span>${T('wavelength λ (cm)', 'அலைநீளம் λ (cm)')}</span></div><div><b>${(st.freq * lam).toFixed(0)}</b><span>${T('speed v = fλ (cm/s)', 'கதி v = fλ (cm/s)')}</span></div>`;
    body.querySelector('#wvNote').textContent = T('Each particle only vibrates about its own position. The wave carries energy along the slinky.', 'ஒவ்வொரு துணிக்கையும் தன் இடத்தைச் சுற்றியே அதிர்கிறது. அலை சிலிங்கியின் வழியே சக்தியைக் கடத்துகிறது.');
  }
  function drawSound(){
    const g = cv.g, ink = cssv('--ink'), f = freq(), sc = 18, x0 = 70, cy = 120, vis = Math.cos(2 * Math.PI * 1.6 * st.t), A = st.ampS * 4.2, Lpx = st.L * sc * 0.75;
    g.clearRect(0, 0, 760, 240); g.fillStyle = cssv('--paper'); g.fillRect(0, 0, 760, 240); g.fillStyle = cssv('--muted'); g.fillRect(x0 - 40, cy - 6, 52, 90); g.fillStyle = ink; g.font = '13px sans-serif'; g.textAlign = 'left'; g.fillText(T('clamp', 'பிடி'), x0 - 36, cy + 104);
    g.strokeStyle = cssv('--green'); g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); for(let i = 0; i <= 40; i++){ const s = i / 40, x = x0 + s * Lpx, y = cy + A * vis * s * s * (3 - s) / 2 * 1; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.lineCap = 'butt';
    g.strokeStyle = cssv('--line'); g.setLineDash([5, 5]); g.beginPath(); g.moveTo(x0, cy); g.lineTo(x0 + Lpx, cy); g.stroke(); g.setLineDash([]); g.fillStyle = cssv('--muted'); g.fillText(T('slow-motion view: the real blade vibrates much faster', 'மெதுவான காட்சி: உண்மையில் கத்தி மிக வேகமாக அதிர்கிறது'), 14, 22);
    const pitch = f > 160 ? T('high', 'உயர்ந்த') : f > 70 ? T('medium', 'நடுத்தர') : T('low', 'தாழ்ந்த');
    body.querySelector('#snRead').innerHTML = `<div><b>${st.L}</b><span>${T('length (cm)', 'நீளம் (cm)')}</span></div><div><b>${f.toFixed(0)}</b><span>${T('frequency (Hz)', 'மீடிறன் (Hz)')}</span></div><div><b>${pitch}</b><span>${T('pitch', 'சுருதி')}</span></div>`;
    body.querySelector('#snNote').textContent = f < 60 ? T('Very low frequencies are hard to hear on small speakers. Try a shorter blade.', 'மிகக் குறைந்த மீடிறன்கள் சிறிய ஒலிபெருக்கிகளில் கேட்பது கடினம். குறுகிய கத்தியை முயலுங்கள்.') : T('Shorter blade: higher frequency and higher pitch. Larger amplitude: louder sound.', 'குறுகிய கத்தி: உயர் மீடிறன், உயர் சுருதி. பெரிய வீச்சம்: உரத்த ஒலி.');
  }
  function loop(now){ const dt = Math.min(.05, (now - (st.last || now)) / 1000); st.last = now; if(st.run || st.tab === 'sound') st.t += dt; if(cv && cv.g) (st.tab === 'wave' ? drawWave : drawSound)(); st.raf = requestAnimationFrame(loop); }
  root.querySelector('#wvTabs').onclick = e => { const b = e.target.closest('[data-seg]'); if(!b) return; st.tab = b.dataset.seg; root.querySelectorAll('#wvTabs [data-seg]').forEach(x => x.classList.toggle('on', x === b)); build(); };
  build(); st.raf = requestAnimationFrame(loop); return { state: st, freq, destroy: () => { cancelAnimationFrame(st.raf); stopTone(); } };
};

// ================= Photosynthesis (Unit 2) =================
Labs.photo = (root, pre = {}) => {
  const st = { tab: pre.tab || 'leaf', leaf: pre.leaf || 'green', light: pre.light || 'open', co2: pre.co2 || 'normal', destarch: true, stage: 0, dist: 30, bic: false, rows: [], raf: 0, bub: [], count: null, last: 0, carry: 0, t: 0 };
  root.innerHTML = `<div id="phTabs">${segs([['leaf', 'Starch test on a leaf', 'இலையில் மாப்பொருட் சோதனை'], ['hydrilla', 'Oxygen from a water plant', 'நீர்த்தாவரத்திலிருந்து ஒட்சிசன்']], st.tab)}</div><div id="phBody"></div>`;
  const body = root.querySelector('#phBody'); let cv = null;
  const STEPS = [[T('1. Leaf kept in sunlight', '1. சூரிய ஒளியில் வைத்த இலை')], [T('2. Boil in water: kills the cells', '2. நீரில் கொதிக்கவை: கலங்கள் இறக்கும்')], [T('3. Boil in ethanol (water bath): removes chlorophyll', '3. எதனோலில் (நீர்த்தொட்டி) கொதிக்கவை: பச்சையம் நீங்கும்')], [T('4. Rinse in warm water: softens the leaf', '4. சூடான நீரில் அலசு: இலை மென்மையாகும்')], [T('5. Add iodine solution', '5. அயடீன் கரைசலைச் சேர்')]];
  const sel = (id, label, opts, cur) => `<label>${label}<select id="${id}">${opts.map(([v, en, ta]) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${T(en, ta)}</option>`).join('')}</select></label>`;
  function build(){
    body.innerHTML = '';
    if(st.tab === 'leaf'){
      body.innerHTML = `<div class="simbar">${sel('phLeaf', T('Leaf', 'இலை'), [['green', 'Green leaf', 'பச்சை இலை'], ['variegated', 'Variegated leaf (green and white)', 'பச்சை, வெள்ளை இலை']], st.leaf)}${sel('phLight', T('Light', 'ஒளி'), [['open', 'Fully in sunlight', 'முழுமையாக ஒளியில்'], ['strip', 'Black paper over the middle', 'நடுவில் கறுப்புத் தாள்'], ['dark', 'Fully covered', 'முழுமையாக மூடியது']], st.light)}${sel('phCo2', T('Carbon dioxide', 'காபனீரொட்சைட்டு'), [['normal', 'Normal air', 'சாதாரண காற்று'], ['koh', 'Absorbed by KOH', 'KOH ஆல் உறிஞ்சப்பட்டது']], st.co2)}<label class="chk"><input type="checkbox" id="phD" ${st.destarch ? 'checked' : ''}> ${T('Destarch the plant first (in the dark)', 'முதலில் தாவரத்தின் மாப்பொருளை நீக்குக (இருளில்)')}</label></div>
      <div class="simbar"><button class="btn" id="phNext"></button><button class="btn ghost" id="phReset">${T('Start again', 'மீண்டும் தொடங்கு')}</button></div><p class="status" id="phStep" role="status"></p><div class="readout" id="phRead"></div>`;
      ['phLeaf:leaf', 'phLight:light', 'phCo2:co2'].forEach(s => { const [id, k] = s.split(':'); body.querySelector('#' + id).onchange = e => { st[k] = e.target.value; st.stage = 0; draw(); }; });
      body.querySelector('#phD').onchange = e => { st.destarch = e.target.checked; st.stage = 0; draw(); }; body.querySelector('#phNext').onclick = () => { st.stage = Math.min(4, st.stage + 1); draw(); }; body.querySelector('#phReset').onclick = () => { st.stage = 0; draw(); };
      cv = canvas(body, 760, 300, T('Leaf', 'இலை')); body.insertBefore(cv.c, body.querySelector('.readout'));
    } else {
      body.innerHTML = `<div class="simbar"><label>${T('Lamp distance (cm)', 'விளக்கின் தூரம் (cm)')} <b id="hyDv">${st.dist}</b><input type="range" id="hyD" min="10" max="80" step="5" value="${st.dist}"></label><label class="chk"><input type="checkbox" id="hyB" ${st.bic ? 'checked' : ''}> ${T('Add sodium bicarbonate (more CO₂)', 'சோடியம் இருகாபனேற்றைச் சேர் (அதிக CO₂)')}</label></div><div class="simbar"><button class="btn" id="hyCount">${T('Count bubbles for 1 minute', '1 நிமிடம் குமிழ்களை எண்ணுக')}</button><button class="btn ghost" id="hyRec" disabled>${T('Record', 'பதிவு செய்')}</button><button class="btn ghost" id="hyClr">${T('Clear', 'அழி')}</button></div>
      <div class="readout" id="hyRead"></div><p class="status" id="hyNote"></p>`;
      body.querySelector('#hyD').oninput = e => { st.dist = +e.target.value; body.querySelector('#hyDv').textContent = st.dist; }; body.querySelector('#hyB').onchange = e => { st.bic = e.target.checked; };
      body.querySelector('#hyCount').onclick = () => { st.count = { t: 0, n: 0, target: rate() }; body.querySelector('#hyRec').disabled = true; }; body.querySelector('#hyRec').onclick = () => { st.rows.push({ d: st.dist, n: st.lastN, b: st.bic }); body.querySelector('#hyRec').disabled = true; graph(); }; body.querySelector('#hyClr').onclick = () => { st.rows = []; graph(); };
      cv = canvas(body, 760, 320, T('Water plant under a funnel', 'புனலின் கீழ் நீர்த்தாவரம்')); body.insertBefore(cv.c, body.querySelector('.readout')); const g2 = canvas(body, 480, 300, ''); g2.c.id = 'hyG'; st.gc = g2.c; graph();
    }
    draw();
  }
  const rate = () => { const I = (20 / st.dist) ** 2, rmax = st.bic ? 90 : 60; return rmax * I / (I + 0.6); };
  function graph(){ const s = st.rows.filter(r => r.b === st.bic).sort((a, b) => a.d - b.d); plot(st.gc, { xmin: 0, xmax: 80, ymin: 0, ymax: 100, xlabel: T('Lamp distance (cm)', 'விளக்கின் தூரம் (cm)'), ylabel: T('Bubbles per minute', 'நிமிடத்துக்குக் குமிழ்கள்'), pts: s.map(r => [r.d, r.n]), joined: true }); }
  // starch present at a given region of the leaf?
  const chl = (core) => st.leaf === 'green' || core, lit = (band) => st.light === 'open' || (st.light === 'strip' && !band), starch = (core, band) => chl(core) && (st.destarch ? (lit(band) && st.co2 === 'normal') : true);
  function leafPath(g){ g.beginPath(); g.moveTo(50, 150); g.bezierCurveTo(120, 40, 280, 40, 350, 150); g.bezierCurveTo(280, 260, 120, 260, 50, 150); g.closePath(); }
  function corePath(g){ g.moveTo(110, 150); g.bezierCurveTo(150, 90, 260, 90, 300, 150); g.bezierCurveTo(260, 210, 150, 210, 110, 150); g.closePath(); }
  function region(g, core, band, fill){ g.save(); leafPath(g); g.clip(); g.beginPath(); if(core){ corePath(g); } else { g.rect(0, 0, 760, 300); corePath(g); } g.clip(core ? 'nonzero' : 'evenodd'); g.beginPath(); if(band) g.rect(170, 0, 80, 300); else { g.rect(0, 0, 170, 300); g.rect(250, 0, 510, 300); } g.clip(); g.fillStyle = fill; g.fillRect(0, 0, 760, 300); g.restore(); }
  function drawLeaf(){
    const g = cv.g, s = st.stage; g.clearRect(0, 0, 760, 300); g.fillStyle = cssv('--paper'); g.fillRect(0, 0, 760, 300);
    const base = s === 0 ? '#3f9a3a' : s === 1 ? '#2f7a2f' : '#f1ead2', white = s === 0 || s === 1 ? '#f6f3e4' : '#f6f2e0';
    [[true, true], [true, false], [false, true], [false, false]].forEach(([core, band]) => { let fill; if(s === 4){ fill = starch(core, band) ? '#1c1b3a' : '#c98a2b'; } else fill = (st.leaf === 'variegated' && !core) ? white : base; region(g, core, band, fill); });
    g.strokeStyle = '#1b3a1b'; g.lineWidth = 2; leafPath(g); g.stroke(); g.strokeStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.moveTo(60, 150); g.lineTo(340, 150); g.stroke();
    if(s === 0){ g.fillStyle = 'rgba(15,15,15,.92)'; if(st.light === 'strip') g.fillRect(170, 70, 80, 160); if(st.light === 'dark'){ leafPath(g); g.fill(); } }
    g.fillStyle = cssv('--ink'); g.font = '15px sans-serif'; g.textAlign = 'center'; g.fillText(STEPS[s][0], 200, 285);
    const bx = 520, by = 130; g.strokeStyle = cssv('--ink'); g.lineWidth = 3; g.fillStyle = s === 2 ? 'rgba(80,170,70,.45)' : s === 4 ? 'rgba(201,138,43,.45)' : 'rgba(120,190,230,.35)'; g.beginPath(); g.moveTo(bx - 60, by - 40); g.lineTo(bx - 60, by + 90); g.quadraticCurveTo(bx - 60, by + 120, bx - 30, by + 120); g.lineTo(bx + 30, by + 120); g.quadraticCurveTo(bx + 60, by + 120, bx + 60, by + 90); g.lineTo(bx + 60, by - 40); g.stroke(); g.fillRect(bx - 58, by + 10, 116, 108);
    g.fillStyle = cssv('--ink'); g.font = '14px sans-serif'; g.fillText(['', T('hot water', 'வெந்நீர்'), T('ethanol', 'எதனோல்'), T('warm water', 'சூடான நீர்'), T('iodine', 'அயடீன்')][s], bx, by + 150);
    if(st.co2 === 'koh' && s === 0){ g.font = '13px sans-serif'; g.fillText(T('KOH absorbs CO₂ in the bag', 'பையினுள் KOH CO₂ ஐ உறிஞ்சுகிறது'), 520, 60); }
    if(s === 4){ const none = []; if(!starch(true, false)) none.push(T('lit green parts', 'ஒளிபட்ட பச்சைப் பகுதிகள்')); const parts = [[true, true, T('covered green part', 'மூடிய பச்சைப் பகுதி')], [true, false, T('lit green part', 'ஒளிபட்ட பச்சைப் பகுதி')], [false, false, T('white (no chlorophyll) part', 'வெண்மைப் (பச்சையமற்ற) பகுதி')]];
      const msg = parts.filter(p => st.leaf === 'green' ? p[0] : true).filter(p => !(st.light !== 'strip' && p[1] === true && p[0])).filter(p => !(st.leaf === 'green' && !p[0])).map(p => `${p[2]}: ${starch(p[0], p[1]) ? T('blue-black (starch)', 'நீலக்கறுப்பு (மாப்பொருள்)') : T('brown (no starch)', 'பழுப்பு (மாப்பொருள் இல்லை)')}`).join(' · ');
      body.querySelector('#phRead').innerHTML = `<div style="grid-column:1/-1"><span>${msg || ''}</span></div>`; body.querySelector('#phStep').textContent = !st.destarch ? T('Starch stored earlier is still there, so the covered parts also turn blue-black. This is why the plant must be destarched first.', 'முன்பு சேமித்த மாப்பொருள் இன்னும் உள்ளது; எனவே மூடிய பகுதிகளும் நீலக்கறுப்பாகின்றன. அதனால்தான் முதலில் மாப்பொருளை நீக்க வேண்டும்.') : st.light !== 'open' ? T('Only the parts that had light, chlorophyll and CO₂ made starch.', 'ஒளி, பச்சையம், CO₂ கிடைத்த பகுதிகள் மட்டுமே மாப்பொருளை உருவாக்கின.') : st.co2 === 'koh' ? T('Without CO₂ no starch was made.', 'CO₂ இல்லாமல் மாப்பொருள் உருவாகவில்லை.') : st.leaf === 'variegated' ? T('Only the green parts (with chlorophyll) made starch.', 'பச்சையம் உள்ள பச்சைப் பகுதிகள் மட்டுமே மாப்பொருளை உருவாக்கின.') : T('The leaf in light, with chlorophyll and CO₂, made starch.', 'ஒளி, பச்சையம், CO₂ உடன் இலை மாப்பொருளை உருவாக்கியது.'); }
    else { body.querySelector('#phRead').innerHTML = ''; body.querySelector('#phStep').textContent = ''; }
    body.querySelector('#phNext').textContent = s >= 4 ? T('Test finished', 'சோதனை முடிந்தது') : s === 0 ? T('Start the starch test', 'மாப்பொருட் சோதனையைத் தொடங்கு') : T('Next step', 'அடுத்த படி'); body.querySelector('#phNext').disabled = s >= 4;
  }
  function drawHy(now){
    const g = cv.g, W = 760, H = 320, r = rate(), ink = cssv('--ink'), dt = Math.min(.05, (now - (st.last || now)) / 1000); st.last = now; st.t += dt; g.clearRect(0, 0, W, H); g.fillStyle = cssv('--paper'); g.fillRect(0, 0, W, H);
    const lx = clamp(40 + st.dist * 3.2 - 130, 30, 300), I = Math.min(1, (20 / st.dist) ** 2 / 1.4); const gl = g.createRadialGradient(lx, 170, 5, lx, 170, 90 + 120 * I); gl.addColorStop(0, `rgba(255,224,90,${0.25 + 0.5 * I})`); gl.addColorStop(1, 'rgba(255,224,90,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    g.fillStyle = '#f2c230'; g.beginPath(); g.arc(lx, 170, 20, 0, 7); g.fill(); g.strokeStyle = ink; g.lineWidth = 3; g.stroke(); g.fillStyle = ink; g.font = '13px sans-serif'; g.textAlign = 'center'; g.fillText(T('lamp', 'விளக்கு'), lx, 210);
    const bx = 520; g.strokeStyle = ink; g.lineWidth = 3; g.fillStyle = 'rgba(120,190,230,.35)'; g.fillRect(bx - 110, 150, 220, 150); g.strokeRect(bx - 110, 90, 220, 210);
    g.fillStyle = '#2f8f3a'; for(let i = 0; i < 12; i++){ g.beginPath(); g.ellipse(bx - 18 + (i % 2 ? 14 : -14) + Math.sin(i) * 4, 280 - i * 10, 14, 4, i % 2 ? .5 : -.5, 0, 7); g.fill(); } g.strokeStyle = '#2f8f3a'; g.lineWidth = 3; g.beginPath(); g.moveTo(bx, 286); g.lineTo(bx, 190); g.stroke();
    g.strokeStyle = ink; g.lineWidth = 3; g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.moveTo(bx - 56, 255); g.lineTo(bx - 14, 160); g.lineTo(bx - 14, 150); g.moveTo(bx + 56, 255); g.lineTo(bx + 14, 160); g.lineTo(bx + 14, 150); g.stroke(); g.strokeRect(bx - 14, 40, 28, 112); g.fillStyle = ink; g.fillText(T('funnel', 'புனல்'), bx + 90, 245); g.fillText(T('test tube of water', 'நீர் நிரம்பிய சோதனைக் குழாய்'), bx, 30);
    const per = r / 60 * 6; st.carry += per * dt; while(st.carry >= 1){ st.carry -= 1; st.bub.push({ x: bx + (Math.random() - .5) * 6, y: 190, vy: 38 + Math.random() * 18 }); if(st.count) st.count.n++; }
    st.bub.forEach(b => { b.y -= b.vy * dt; b.x += Math.sin(b.y * .1) * .3; }); st.bub = st.bub.filter(b => b.y > 60); g.fillStyle = 'rgba(255,255,255,.85)'; g.strokeStyle = '#4a90c2'; g.lineWidth = 1.5; st.bub.forEach(b => { g.beginPath(); g.arc(b.x, b.y, 3.5, 0, 7); g.fill(); g.stroke(); });
    if(st.count){ st.count.t += dt; if(st.count.t >= 10){ st.lastN = st.count.n; st.count = null; body.querySelector('#hyRec').disabled = false; body.querySelector('#hyNote').textContent = `${T('Counted', 'எண்ணியவை')}: ${st.lastN} ${T('bubbles per minute', 'குமிழ்கள்/நிமிடம்')}`; } }
    body.querySelector('#hyRead').innerHTML = `<div><b>${st.dist}</b><span>${T('lamp distance (cm)', 'விளக்கின் தூரம் (cm)')}</span></div><div><b>${r.toFixed(0)}</b><span>${T('bubbles per minute', 'நிமிடத்துக்குக் குமிழ்கள்')}</span></div><div><b>${st.count ? st.count.n : (st.lastN != null ? st.lastN : '–')}</b><span>${T('your count (per min)', 'உங்கள் எண்ணிக்கை (/நிமி)')}</span></div>`;
    if(!st.count && st.lastN == null) body.querySelector('#hyNote').textContent = T('More light and more CO₂ make the plant release oxygen faster.', 'அதிக ஒளியும் அதிக CO₂ உம் தாவரம் ஒட்சிசனை வேகமாக வெளிவிடச் செய்கின்றன.');
  }
  function draw(){ if(cv && cv.g && st.tab === 'leaf') drawLeaf(); }
  function loop(now){ if(cv && cv.g && st.tab === 'hydrilla') drawHy(now); st.raf = requestAnimationFrame(loop); }
  root.querySelector('#phTabs').onclick = e => { const b = e.target.closest('[data-seg]'); if(!b) return; st.tab = b.dataset.seg; root.querySelectorAll('#phTabs [data-seg]').forEach(x => x.classList.toggle('on', x === b)); build(); };
  build(); st.raf = requestAnimationFrame(loop); return { state: st, starch, rate, destroy: () => cancelAnimationFrame(st.raf) };
};

// ================= Solutions: solubility and concentration (Unit 3) =================
Labs.solu = (root, pre = {}) => {
  const TS = [0, 20, 40, 60, 80, 100];
  const SOL = { nacl: { n: T('Table salt (NaCl)', 'சமையல் உப்பு (NaCl)'), s: [35.7, 35.9, 36.4, 37.1, 38.0, 39.2], col: '#1e88e5', M: 58.5, tint: null }, sucrose: { n: T('Sugar (sucrose)', 'சீனி (சுக்குரோசு)'), s: [179, 204, 238, 287, 362, 487], col: '#e53935', M: 342.3, tint: null } };
  const SOLUTES = { nacl: { n: T('Sodium chloride (NaCl)', 'சோடியம் குளோரைட்டு (NaCl)'), M: 58.5, c0: 0, col: null }, glucose: { n: T('Glucose', 'குளுக்கோசு'), M: 180, c0: 0, col: null }, urea: { n: T('Urea', 'யூரியா'), M: 60, c0: 0, col: null }, cuso4: { n: T('Copper(II) sulphate pentahydrate', 'செப்பு(II) சல்பேற்று பென்றாஹைட்ரேற்று'), M: 249.7, c0: .5, col: [30, 110, 230] }, kmno4: { n: T('Potassium permanganate', 'பொட்டாசியம் பேர்மங்கனேற்று'), M: 158, c0: .012, col: [140, 20, 160] } };
  const st = { tab: pre.tab || 'solubility', solute: pre.solute && SOL[pre.solute] ? pre.solute : 'nacl', vol: 50, temp: 25, added: 0, cs: SOLUTES[pre.solute] ? pre.solute : 'nacl', mass: pre.solute === 'kmno4' ? 0.2 : 10, cv: pre.solute === 'kmno4' ? 50 : 250, target: null, rows: [], msg: '' };
  const interp = (arr, T0) => { const i = clamp(Math.floor(T0 / 20), 0, 4), f = (T0 - TS[i]) / 20; return arr[i] + (arr[i + 1] - arr[i]) * f; };
  root.innerHTML = `<div id="soTabs">${segs([['solubility', 'Solubility', 'கரைதிறன்'], ['concentration', 'Concentration', 'செறிவு']], st.tab)}</div><div id="soBody"></div>`;
  const body = root.querySelector('#soBody'); let cv = null, gc = null;
  const opts = (o, cur) => Object.entries(o).map(([k, v]) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${v.n}</option>`).join('');
  function build(){
    body.innerHTML = '';
    if(st.tab === 'solubility'){
      body.innerHTML = `<div class="simbar"><label>${T('Solute', 'கரையம்')}<select id="soS">${opts(SOL, st.solute)}</select></label><label>${T('Water (cm³)', 'நீர் (cm³)')}<select id="soV"><option>50</option><option>100</option></select></label><label>${T('Temperature (°C)', 'வெப்பநிலை (°C)')} <b id="soTv">${st.temp}</b><input type="range" id="soT" min="0" max="100" step="5" value="${st.temp}"></label></div><div class="simbar"><button class="btn" data-add="1">+1 g</button><button class="btn" data-add="5">+5 g</button><button class="btn" data-add="20">+20 g</button><button class="btn ghost" id="soR">${T('Empty the beaker', 'முகவையைக் காலியாக்கு')}</button></div><div class="readout" id="soRead"></div><p class="status" id="soNote" role="status"></p>`;
      body.querySelector('#soV').value = st.vol; body.querySelector('#soS').onchange = e => { st.solute = e.target.value; st.added = 0; draw(); }; body.querySelector('#soV').onchange = e => { st.vol = +e.target.value; st.added = 0; draw(); };
      body.querySelector('#soT').oninput = e => { st.temp = +e.target.value; body.querySelector('#soTv').textContent = st.temp; draw(); }; body.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { st.added += +b.dataset.add; draw(); }); body.querySelector('#soR').onclick = () => { st.added = 0; draw(); };
      cv = canvas(body, 760, 300, T('Beaker of water', 'நீர் உள்ள முகவை')); body.insertBefore(cv.c, body.querySelector('.readout')); gc = canvas(body, 480, 300, ''); gc.c.width = 480; gc.c.height = 300; gc.g.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      body.innerHTML = `<div class="simbar"><label>${T('Solute', 'கரையம்')}<select id="coS">${opts(SOLUTES, st.cs)}</select></label><label>${T('Volume of solution (cm³)', 'கரைசலின் கனவளவு (cm³)')}<select id="coV">${[50, 100, 250, 500].map(v => `<option>${v}</option>`).join('')}</select></label><label>${T('Mass of solute (g)', 'கரையத்தின் திணிவு (g)')} <b id="coMv">${st.mass}</b><input type="range" id="coM" min="0" max="60" step="0.1" value="${st.mass}"></label></div><div class="simbar"><button class="btn" id="coNew">${T('New challenge', 'புதிய சவால்')}</button><button class="btn ghost" id="coCheck">${T('Check my mass', 'என் திணிவைச் சரிபார்')}</button><button class="btn ghost" id="coRec">${T('Record', 'பதிவு செய்')}</button><button class="btn ghost" id="coClr">${T('Clear', 'அழி')}</button></div><p class="status" id="coTask"></p><div class="readout" id="coRead"></div><div class="scroll"><table class="tbl" id="coTbl"></table></div>`;
      body.querySelector('#coV').value = st.cv;
      body.querySelector('#coS').onchange = e => { st.cs = e.target.value; draw(); }; body.querySelector('#coV').onchange = e => { st.cv = +e.target.value; draw(); }; body.querySelector('#coM').oninput = e => { st.mass = +e.target.value; body.querySelector('#coMv').textContent = st.mass; draw(); };
      body.querySelector('#coNew').onclick = () => { const cs = [0.1, 0.2, 0.5, 1.0], vs = [100, 250, 500]; st.target = { c: cs[Math.floor(Math.random() * 4)], v: vs[Math.floor(Math.random() * 3)] }; st.cv = st.target.v; body.querySelector('#coV').value = st.cv; st.mass = 0; body.querySelector('#coM').value = 0; body.querySelector('#coMv').textContent = 0; st.msg = ''; draw(); };
      body.querySelector('#coCheck').onclick = check; body.querySelector('#coRec').onclick = () => { const S = SOLUTES[st.cs]; st.rows.push({ n: S.n, m: st.mass, v: st.cv, c: conc().c, col: tint() }); draw(); }; body.querySelector('#coClr').onclick = () => { st.rows = []; draw(); };
      cv = canvas(body, 760, 260, T('Flask of solution', 'கரைசல் உள்ள குடுவை')); body.insertBefore(cv.c, body.querySelector('.readout'));
    }
    draw();
  }
  const conc = () => { const S = SOLUTES[st.cs], n = st.mass / S.M, V = st.cv / 1000; return { n, c: n / V, g: st.mass / V }; };
  const tint = () => { const S = SOLUTES[st.cs], c = conc().c; if(!S.col) return 'rgba(200,225,245,.6)'; const a = 1 - Math.exp(-c / S.c0); return `rgba(${S.col[0]},${S.col[1]},${S.col[2]},${clamp(0.12 + a * 0.85, 0, .97)})`; };
  function check(){ const S = SOLUTES[st.cs]; if(!st.target){ st.msg = T('Press "New challenge" first.', '"புதிய சவால்" ஐ முதலில் அழுத்துக.'); draw(); return; } const need = st.target.c * st.target.v / 1000 * S.M, ok = Math.abs(st.mass - need) <= need * 0.02 + 0.05;
    st.msg = ok ? `${T('Correct!', 'சரி!')} m = c × V × M = ${st.target.c} × ${st.target.v / 1000} × ${S.M} = ${need.toFixed(2)} g` : `${T('Not yet.', 'இன்னும் இல்லை.')} ${st.mass > need ? T('Too much.', 'அதிகம்.') : T('Too little.', 'குறைவு.')} ${T('Hint: m = c × V × M', 'குறிப்பு: m = c × V × M')}`; draw(); }
  function drawSolubility(){
    const g = cv.g, ink = cssv('--ink'), S = SOL[st.solute], sPer = interp(S.s, st.temp), limit = sPer * st.vol / 100, diss = Math.min(st.added, limit), und = Math.max(0, st.added - limit), sat = st.added >= limit - 1e-9 && st.added > 0;
    g.clearRect(0, 0, 760, 300); g.fillStyle = cssv('--paper'); g.fillRect(0, 0, 760, 300); const bx = 380, w = 240, top = 40, bot = 270, lvl = 110 + (st.vol === 100 ? -30 : 0);
    g.fillStyle = `rgba(120,190,230,${0.3 + 0.15 * Math.min(1, diss / Math.max(limit, 1))})`; g.fillRect(bx - w / 2, lvl, w, bot - lvl); g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.moveTo(bx - w / 2, top); g.lineTo(bx - w / 2, bot); g.lineTo(bx + w / 2, bot); g.lineTo(bx + w / 2, top); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.8)'; g.strokeStyle = '#6aa0c8'; g.lineWidth = 1; const nd = Math.round(60 * Math.min(1, diss / Math.max(limit, 1))); for(let i = 0; i < nd; i++){ const x = bx - w / 2 + 8 + ((i * 53) % (w - 16)), y = lvl + 10 + ((i * 37) % (bot - lvl - 24)); g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); g.stroke(); }
    const hh = Math.min(70, und * 1.1); g.fillStyle = '#f5f5f0'; g.strokeStyle = '#999'; g.lineWidth = 1.5; if(und > 0){ g.beginPath(); g.moveTo(bx - 80, bot - 2); g.quadraticCurveTo(bx, bot - 2 - hh * 1.6, bx + 80, bot - 2); g.closePath(); g.fill(); g.stroke(); }
    g.fillStyle = ink; g.font = '14px sans-serif'; g.textAlign = 'center'; g.fillText(`${st.vol} cm³ ${T('water', 'நீர்')} · ${st.temp} °C`, bx, bot + 22); g.textAlign = 'left'; g.fillText(und > 0 ? T('Undissolved solid at the bottom', 'அடியில் கரையாத திண்மம்') : '', bx + w / 2 + 14, bot - 20);
    body.querySelector('#soRead').innerHTML = `<div><b>${fx(sPer, 1)}</b><span>${T('solubility (g per 100 g water)', 'கரைதிறன் (100 g நீருக்கு g)')}</span></div><div><b>${fx(limit, 1)}</b><span>${T('most that can dissolve (g)', 'கரையக்கூடிய அதிகபட்சம் (g)')}</span></div><div><b>${fx(st.added, 0)}</b><span>${T('added (g)', 'சேர்த்தது (g)')}</span></div><div><b>${fx(diss, 1)}</b><span>${T('dissolved (g)', 'கரைந்தது (g)')}</span></div><div><b>${fx(und, 1)}</b><span>${T('undissolved (g)', 'கரையாதது (g)')}</span></div>`;
    body.querySelector('#soNote').textContent = st.added === 0 ? T('Add solute a little at a time and watch for the point where it stops dissolving.', 'கரையத்தைச் சிறிது சிறிதாகச் சேர்த்து, கரைவது நிற்கும் புள்ளியைக் கவனிக்க.') : sat ? T('Saturated solution: no more solute can dissolve at this temperature.', 'நிரம்பல் கரைசல்: இந்த வெப்பநிலையில் மேலும் கரையம் கரையாது.') : T('Unsaturated solution: more solute can still dissolve.', 'நிரம்பாக் கரைசல்: இன்னும் கரையம் கரைய முடியும்.');
    const pts = TS.concat([10, 30, 50, 70, 90]).sort((a, b) => a - b).map(t0 => [t0, interp(S.s, t0)]), ex = Object.keys(SOL).filter(k => k !== st.solute).map(k => ({ pts: TS.map(t0 => [t0, interp(SOL[k].s, t0)]), color: '#9aa7b3', label: SOL[k].n }));
    const ymax = st.solute === 'sucrose' ? 500 : 500; plot(gc.c, { xmin: 0, xmax: 100, ymin: 0, ymax, xlabel: T('Temperature (°C)', 'வெப்பநிலை (°C)'), ylabel: T('Solubility (g / 100 g water)', 'கரைதிறன் (g / 100 g நீர்)'), pts: [], extra: [{ pts, color: S.col, label: S.n }].concat(ex), mark: [st.temp, sPer] });
  }
  function drawConc(){
    const g = cv.g, ink = cssv('--ink'), c = conc(), S = SOLUTES[st.cs]; g.clearRect(0, 0, 760, 260); g.fillStyle = cssv('--paper'); g.fillRect(0, 0, 760, 260);
    const bx = 380; g.fillStyle = tint(); g.beginPath(); g.moveTo(bx - 70, 130); g.lineTo(bx - 70, 130); g.lineTo(bx + 70, 130); g.lineTo(bx + 76, 215); g.quadraticCurveTo(bx, 240, bx - 76, 215); g.closePath(); g.fill(); g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.moveTo(bx - 14, 20); g.lineTo(bx - 14, 100); g.lineTo(bx - 82, 205); g.quadraticCurveTo(bx - 90, 238, bx - 40, 240); g.lineTo(bx + 40, 240); g.quadraticCurveTo(bx + 90, 238, bx + 82, 205); g.lineTo(bx + 14, 100); g.lineTo(bx + 14, 20); g.stroke();
    g.fillStyle = ink; g.font = '14px sans-serif'; g.textAlign = 'center'; g.fillText(`${st.cv} cm³`, bx, 256);
    body.querySelector('#coRead').innerHTML = `<div><b>${fx(st.mass, 1)}</b><span>${T('mass (g)', 'திணிவு (g)')}</span></div><div><b>${fx(c.n, 3)}</b><span>${T('amount (mol) = m ÷ M', 'அளவு (mol) = m ÷ M')}</span></div><div><b>${fx(c.c, 3)}</b><span>${T('concentration (mol dm⁻³)', 'செறிவு (mol dm⁻³)')}</span></div><div><b>${fx(c.g, 1)}</b><span>${T('concentration (g dm⁻³)', 'செறிவு (g dm⁻³)')}</span></div>`;
    body.querySelector('#coTask').textContent = st.target ? `${T('Prepare', 'தயாரிக்க')} ${st.target.v} cm³ ${T('of', '')} ${st.target.c} mol dm⁻³ ${S.n}. ${T('Molar mass', 'மூலர் திணிவு')} M = ${S.M} g mol⁻¹. ${st.msg}` : `${S.n}: M = ${S.M} g mol⁻¹. ${T('Press "New challenge" to practise, or move the mass slider.', 'பயிற்சிக்கு "புதிய சவால்" ஐ அழுத்துக, அல்லது திணிவுச் சறுக்கியை நகர்த்துக.')}`;
    body.querySelector('#coTbl').innerHTML = `<tr><th>${T('Solute', 'கரையம்')}</th><th>m (g)</th><th>V (cm³)</th><th>c (mol dm⁻³)</th><th>${T('Colour', 'நிறம்')}</th></tr>` + st.rows.map(r => `<tr><td>${r.n}</td><td>${fx(r.m, 1)}</td><td>${r.v}</td><td>${fx(r.c, 3)}</td><td><span class="sw" style="background:${r.col}"></span></td></tr>`).join('');
  }
  function draw(){ if(!cv || !cv.g) return; st.tab === 'solubility' ? drawSolubility() : drawConc(); }
  root.querySelector('#soTabs').onclick = e => { const b = e.target.closest('[data-seg]'); if(!b) return; st.tab = b.dataset.seg; root.querySelectorAll('#soTabs [data-seg]').forEach(x => x.classList.toggle('on', x === b)); build(); };
  build(); return { state: st, conc, interp, SOL, SOLUTES, destroy() {} };
};

// ================= Heat of reactions (Unit 8) =================
Labs.heat = (root, pre = {}) => {
  const RX = {
    naoh: { n: T('Sodium hydroxide dissolving in water (2 g in 50 cm³)', 'சோடியம் ஐதரொட்சைட்டு நீரில் கரைதல் (50 cm³ இல் 2 g)'), dT: 10.5, tint: 'rgba(120,190,230,.4)' },
    nh4cl: { n: T('Ammonium chloride dissolving in water (5 g in 50 cm³)', 'அமோனியம் குளோரைட்டு நீரில் கரைதல் (50 cm³ இல் 5 g)'), dT: -5.0, tint: 'rgba(120,190,230,.4)' },
    mg: { n: T('Magnesium ribbon in dilute hydrochloric acid (0.2 g in 50 cm³)', 'ஐதான ஐதரோகுளோரிக் அமிலத்தில் மகனீசியம் நாடா (50 cm³ இல் 0.2 g)'), dT: 17.0, tint: 'rgba(230,230,150,.45)' },
    cit: { n: T('Citric acid with sodium bicarbonate in water', 'நீரில் சிற்றிக் அமிலமும் சோடியம் இருகாபனேற்றும்'), dT: -6.5, tint: 'rgba(255,255,255,.55)' },
    neut: { n: T('Hydrochloric acid + sodium hydroxide (50 cm³ of 2 mol dm⁻³ each)', 'ஐதரோகுளோரிக் அமிலம் + சோடியம் ஐதரொட்சைட்டு (ஒவ்வொன்றும் 2 mol dm⁻³, 50 cm³)'), dT: 12.5, tint: 'rgba(160,210,240,.45)' }
  };
  const T0 = 28, SCALE = 20, f0 = t => (1 - Math.exp(-t / 8)) * Math.exp(-t / 260); let fmax = 0; for(let t = 0; t <= 300; t += .5) fmax = Math.max(fmax, f0(t));
  const st = { rx: RX[pre.rx] ? pre.rx : 'naoh', t: -1, pts: [], raf: 0, last: 0, done: false, peak: 0 };
  root.innerHTML = `<div class="simbar"><label>${T('Reaction', 'தாக்கம்')}<select id="htR">${Object.entries(RX).map(([k, v]) => `<option value="${k}" ${k === st.rx ? 'selected' : ''}>${v.n}</option>`).join('')}</select></label><button class="btn" id="htGo">${T('Add and stir', 'சேர்த்துக் கலக்கு')}</button><button class="btn ghost" id="htReset">${T('Reset', 'மீளமை')}</button></div><div class="tubes" id="htViz"></div><div class="readout" id="htRead"></div><p class="status" id="htNote" role="status"></p><canvas id="htG" class="simcv" width="480" height="300"></canvas><div id="htCalc"></div>`;
  const q = s => root.querySelector(s), temp = t => T0 + RX[st.rx].dT * f0(t) / fmax;
  function viz(Tc){
    const lvl = clamp((Tc - 10) / 50, 0, 1), col = Tc > T0 + .4 ? '#e53935' : Tc < T0 - .4 ? '#1e88e5' : '#555', hf = 150 * lvl, ink = cssv('--ink');
    q('#htViz').innerHTML = `<svg viewBox="0 0 320 220" width="320" role="img" aria-label="${T('Beaker with a thermometer', 'வெப்பமானியுடன் முகவை')}"><path d="M60 40 L60 190 Q60 205 75 205 L205 205 Q220 205 220 190 L220 40" fill="none" stroke="${ink}" stroke-width="4"/><rect x="63" y="${st.t < 0 ? 110 : 110}" width="154" height="${st.t < 0 ? 93 : 93}" fill="${RX[st.rx].tint}"/><rect x="240" y="20" width="20" height="150" rx="10" fill="none" stroke="${ink}" stroke-width="3"/><rect x="244" y="${170 - hf}" width="12" height="${hf + 6}" fill="${col}" style="transition:all .2s"/><circle cx="250" cy="182" r="14" fill="${col}" stroke="${ink}" stroke-width="3"/><rect x="236" y="20" width="28" height="4" fill="${ink}"/><text x="250" y="214" text-anchor="middle" font-size="16" fill="${ink}">${Tc.toFixed(1)} °C</text><path d="M250 60 L250 150" stroke="${ink}" stroke-width="1" stroke-dasharray="2 4"/></svg>`;
  }
  function graph(){ plot(q('#htG'), { xmin: 0, xmax: 120, ymin: 10, ymax: 50, xlabel: T('Time (s)', 'நேரம் (s)'), ylabel: T('Temperature (°C)', 'வெப்பநிலை (°C)'), pts: [], extra: [{ pts: st.pts, color: '#e53935' }], mark: st.pts.length ? st.pts[st.pts.length - 1] : null }); }
  function energy(){
    const exo = RX[st.rx].dT > 0, d = q('#htCalc'); const hx = exo ? 'rgba(229,57,53,.9)' : 'rgba(30,136,229,.9)';
    d.innerHTML = `<svg viewBox="0 0 360 150" width="360" role="img"><text x="8" y="14" font-size="13" fill="${cssv('--ink')}">${T('Energy diagram', 'சக்தி வரைபடம்')}</text><line x1="40" y1="${exo ? 40 : 100}" x2="140" y2="${exo ? 40 : 100}" stroke="${cssv('--ink')}" stroke-width="4"/><line x1="220" y1="${exo ? 100 : 40}" x2="320" y2="${exo ? 100 : 40}" stroke="${cssv('--ink')}" stroke-width="4"/><path d="M140 ${exo ? 40 : 100} L220 ${exo ? 100 : 40}" stroke="${cssv('--muted')}" stroke-dasharray="4 4" fill="none"/><line x1="180" y1="${exo ? 44 : 96}" x2="180" y2="${exo ? 96 : 44}" stroke="${hx}" stroke-width="4"/><path d="M${exo ? '174 88 L180 98 L186 88' : '174 52 L180 42 L186 52'}" fill="${hx}"/><text x="90" y="${exo ? 30 : 120}" text-anchor="middle" font-size="12" fill="${cssv('--ink')}">${T('reactants', 'தாக்கிகள்')}</text><text x="270" y="${exo ? 120 : 30}" text-anchor="middle" font-size="12" fill="${cssv('--ink')}">${T('products', 'விளைபொருள்கள்')}</text><text x="190" y="140" text-anchor="middle" font-size="12" fill="${cssv('--ink')}">${exo ? T('heat given out: exothermic (ΔH negative)', 'வெப்பம் வெளியேறுகிறது: புறவெப்பத் தாக்கம் (ΔH எதிர்)') : T('heat taken in: endothermic (ΔH positive)', 'வெப்பம் உள்ளெடுக்கப்படுகிறது: அகவெப்பத் தாக்கம் (ΔH நேர்)')}</text></svg>`;
    if(st.rx === 'neut'){ const dT = RX.neut.dT, qJ = 100 * 4.2 * dT, n = 0.1; d.innerHTML += `<p class="status">${T('Heat given out', 'வெளிவிடப்பட்ட வெப்பம்')}: q = m × c × ΔT = 100 g × 4.2 J g⁻¹ K⁻¹ × ${dT.toFixed(1)} K = <b>${qJ.toFixed(0)} J</b><br>${T('Amount of water formed', 'உருவான நீரின் அளவு')}: n = 0.100 mol → ΔH = −q ÷ n = <b>−${(qJ / n / 1000).toFixed(1)} kJ mol⁻¹</b><br>${T('The accepted value is about −57 kJ mol⁻¹. Some heat is lost to the surroundings.', 'ஏற்கப்பட்ட பெறுமானம் ஏறக்குறைய −57 kJ mol⁻¹. சிறிது வெப்பம் சூழலுக்கு இழக்கப்படுகிறது.')}</p>`; }
  }
  function readout(Tc){ const dT = (st.pts.length ? Math.max(...st.pts.map(p => Math.abs(p[1] - T0))) : 0) * Math.sign(RX[st.rx].dT);
    q('#htRead').innerHTML = `<div><b>${T0.toFixed(1)}</b><span>${T('start temperature (°C)', 'ஆரம்ப வெப்பநிலை (°C)')}</span></div><div><b>${Tc.toFixed(1)}</b><span>${T('temperature now (°C)', 'இப்போதைய வெப்பநிலை (°C)')}</span></div><div><b>${st.t < 0 ? '–' : (dT > 0 ? '+' : '') + dT.toFixed(1)}</b><span>${T('largest change ΔT (K)', 'பெரிய மாற்றம் ΔT (K)')}</span></div>`; }
  function tick(now){ const dt = Math.min(.05, (now - (st.last || now)) / 1000); st.last = now;
    if(st.t >= 0 && !st.done){ st.t += dt * SCALE; if(st.t >= 120){ st.t = 120; st.done = true; } const Tc = temp(st.t); st.pts.push([+st.t.toFixed(1), Tc]); viz(Tc); readout(Tc); graph();
      if(st.done) q('#htNote').textContent = RX[st.rx].dT > 0 ? T('The temperature rose: heat was given out. This is an exothermic reaction.', 'வெப்பநிலை உயர்ந்தது: வெப்பம் வெளிவிடப்பட்டது. இது புறவெப்பத் தாக்கம்.') : T('The temperature fell: heat was taken in. This is an endothermic reaction.', 'வெப்பநிலை குறைந்தது: வெப்பம் உள்ளெடுக்கப்பட்டது. இது அகவெப்பத் தாக்கம்.'); }
    st.raf = requestAnimationFrame(tick); }
  function reset(){ st.t = -1; st.pts = []; st.done = false; viz(T0); readout(T0); graph(); energy(); q('#htNote').textContent = T('Press "Add and stir" and watch the thermometer. The experiment runs faster than real time.', '"சேர்த்துக் கலக்கு" ஐ அழுத்தி வெப்பமானியை அவதானிக்க. பரிசோதனை உண்மை நேரத்தைவிட வேகமாக ஓடும்.'); }
  q('#htR').onchange = e => { st.rx = e.target.value; reset(); }; q('#htGo').onclick = () => { reset(); st.t = 0; }; q('#htReset').onclick = reset;
  reset(); st.raf = requestAnimationFrame(tick); return { state: st, RX, temp, destroy: () => cancelAnimationFrame(st.raf) };
};

// ================= Indicators (Unit 7) =================
Labs.indic = root => {
  const N = { red: T('red', 'சிவப்பு'), orange: T('orange', 'செம்மஞ்சள்'), yellow: T('yellow', 'மஞ்சள்'), green: T('green', 'பச்சை'), bluegreen: T('blue-green', 'நீலப்பச்சை'), blue: T('blue', 'நீலம்'), purple: T('purple', 'ஊதா'), pink: T('pink', 'இளஞ்சிவப்பு'), none: T('colourless', 'நிறமற்றது') };
  const SUB = [['hcl', T('Dilute hydrochloric acid', 'ஐதான ஐதரோகுளோரிக் அமிலம்'), 1.0], ['h2so4', T('Dilute sulphuric acid', 'ஐதான சல்பூரிக் அமிலம்'), 0.8], ['lime', T('Lime juice', 'எலுமிச்சைச் சாறு'), 2.2], ['vinegar', T('Vinegar', 'வினிகர்'), 2.8], ['water', T('Distilled water', 'காய்ச்சி வடித்த நீர்'), 7.0], ['soap', T('Soap solution', 'சவர்க்காரக் கரைசல்'), 9.8], ['limewater', T('Lime water', 'சுண்ணாம்பு நீர்'), 12.4], ['naoh', T('Dilute sodium hydroxide', 'ஐதான சோடியம் ஐதரொட்சைட்டு'), 13.0]];
  const IND = [['bl', T('Blue litmus paper', 'நீலப் பாசிச் சாயத்தாள்'), true, [[4.5, '#e53935', 'red'], [99, '#3359c4', 'blue']]], ['rl', T('Red litmus paper', 'சிவப்புப் பாசிச் சாயத்தாள்'), true, [[8.3, '#e53935', 'red'], [99, '#3359c4', 'blue']]],
    ['mo', T('Methyl orange', 'மெதைல் செம்மஞ்சள்'), false, [[3.1, '#e8412c', 'red'], [4.4, '#f08a24', 'orange'], [99, '#f2c315', 'yellow']]], ['pp', T('Phenolphthalein', 'பினோப்தலீன்'), false, [[8.2, '#eef3f7', 'none'], [99, '#e83e8c', 'pink']]],
    ['ui', T('Universal indicator (pH scale)', 'பொதுக் காட்டி (pH அளவுத்திட்டம்)'), false, [[2.5, '#e8352c', 'red'], [4.5, '#f7931e', 'orange'], [6, '#f9c823', 'yellow'], [7.5, '#43a047', 'green'], [8.5, '#1f9e8e', 'bluegreen'], [10.5, '#2a6fc4', 'blue'], [99, '#6a3fa0', 'purple']]]];
  const opts = a => a.map((x, i) => `<option value="${i}">${x[1]}</option>`).join('');
  root.innerHTML = `<div class="simbar"><label>${T('Liquid', 'திரவம்')}<select id="inS">${opts(SUB)}</select></label><label>${T('Indicator', 'காட்டி')}<select id="inI">${opts(IND)}</select></label><button class="btn" id="inAdd">${T('Add the indicator', 'காட்டியைச் சேர்')}</button><button class="btn ghost" id="inAll">${T('Test all liquids', 'எல்லாத் திரவங்களையும் சோதி')}</button><label class="chk"><input type="checkbox" id="inPh"> ${T('Show pH (teacher)', 'pH ஐக் காட்டு (ஆசிரியர்)')}</label></div>
  <div class="tubes"><figure><svg viewBox="0 0 90 140" width="110" role="img"><rect id="inLiq" x="22" y="58" width="46" height="62" rx="16" fill="#d8efff" style="transition:fill .8s"/><rect id="inStrip" x="40" y="8" width="10" height="84" fill="#ccc" stroke="#888" hidden/><rect x="20" y="6" width="50" height="116" rx="18" fill="none" stroke="${cssv('--ink')}" stroke-width="3"/></svg><figcaption id="inCap"></figcaption></figure></div>
  <div class="scroll"><table class="tbl" id="inTbl"></table></div><button class="btn ghost" id="inClr">${T('Clear table', 'அட்டவணையை அழி')}</button>`;
  const q = s => root.querySelector(s), rows = [], liq = q('#inLiq'), strip = q('#inStrip');
  const result = (ii, ph) => { const s = IND[ii][3].find(x => ph <= x[0]); return [s[1], N[s[2]]]; }, kind = ph => ph < 6.8 ? T('acid', 'அமிலம்') : ph > 7.2 ? T('base', 'மூலம்') : T('neutral', 'நடுநிலை');
  function table(){ const ph = q('#inPh').checked; q('#inTbl').innerHTML = `<tr><th>${T('Liquid', 'திரவம்')}</th><th>${T('Indicator', 'காட்டி')}</th><th>${T('Colour', 'நிறம்')}</th>${ph ? '<th>pH</th><th></th>' : ''}</tr>` + rows.map(r => `<tr><td>${SUB[r.s][1]}</td><td>${IND[r.i][1]}</td><td>${sw(r.hex, r.name)}</td>${ph ? `<td>${SUB[r.s][2]}</td><td>${kind(SUB[r.s][2])}</td>` : ''}</tr>`).join(''); }
  function add(s, i, show){ const [hex, name] = result(i, SUB[s][2]); rows.push({ s, i, hex, name }); if(show){ if(IND[i][2]){ strip.hidden = false; strip.setAttribute('fill', hex); liq.setAttribute('fill', '#d8efff'); } else { strip.hidden = true; liq.setAttribute('fill', hex); } q('#inCap').textContent = `${SUB[s][1]} + ${IND[i][1]}: ${name}`; } }
  q('#inAdd').onclick = () => { add(+q('#inS').value, +q('#inI').value, true); table(); }; q('#inAll').onclick = () => { SUB.forEach((_, s) => add(s, +q('#inI').value, s === SUB.length - 1)); table(); };
  q('#inPh').onchange = table; q('#inClr').onclick = () => { rows.length = 0; table(); }; table();
  return { state: { rows, SUB, IND, result, kind }, destroy() {} };
};