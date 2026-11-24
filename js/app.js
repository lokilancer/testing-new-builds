// Lab Guide G11, Grade 11 Science Part I: library, activity pages, virtual labs, textbook page numbers.
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const app = $('app'), st = { unit: 'all', q: '', labOnly: false, sim: null, present: false };
window.REFS = window.REFS || {};
const KINDS = { lab: 'k.lab', obs: 'k.obs', model: 'k.model', disc: 'k.disc' };

// ---------- Textbook page references ----------
const localRefs = () => { try{ return JSON.parse(localStorage.getItem('g11-refs') || '{}') || {}; }catch(e){ return {}; } };
const clean = (s, n, strict) => { s = String(s || '').trim().slice(0, n); return strict ? s.replace(/[^0-9A-Za-z,\-–.\s]/g, '') : s; };
const getRef = (id, m) => { const l = localRefs(); return (l[id] && l[id][m]) || (window.REFS[id] && window.REFS[id][m]) || null; };
// the reference shown for the chosen language; English falls back to the Tamil-medium page, with a note
function shownRef(id){ const own = getRef(id, LANG); if(own && own.pages) return { r: own, medium: LANG, fallback: false }; const ta = getRef(id, 'ta'); return ta && ta.pages ? { r: ta, medium: 'ta', fallback: LANG !== 'ta' } : null; }
const pageTag = id => { const s = shownRef(id); return s ? `<span class="tag">${t('a.page')} ${esc(s.r.pages)}${s.fallback ? ' (' + t('m.ta') + ')' : ''}</span>` : ''; };

// ---------- Chrome ----------
function chrome(){
  document.documentElement.lang = LANG; $('appTag').textContent = t('app.tag');
  document.querySelectorAll('.langs button').forEach(b => { const on = b.dataset.lang === LANG; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  $('foot').innerHTML = `<a href="#/about" style="color:inherit;font-weight:700">${t('about.link')}</a> · ${esc(t('foot'))}`; $('pExit').textContent = t('p.exit');
  $('themeTxt').textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾';
}
function setLang(l){ LANG = l; try{ localStorage.setItem('g11-lang', l); }catch(e){} chrome(); route(); }
document.querySelectorAll('.langs button').forEach(b => b.onclick = () => setLang(b.dataset.lang));
$('themeBtn').onclick = () => { const d = document.documentElement, dark = d.dataset.theme !== 'dark'; if(dark) d.dataset.theme = 'dark'; else delete d.dataset.theme; try{ localStorage.setItem('g11-theme', dark ? 'dark' : 'light'); }catch(e){} chrome(); if(st.sim) route(); };
const ZOOMS = [1, 1.2, 1.4];
$('zoomBtn').onclick = () => { const cur = +(getComputedStyle(document.documentElement).getPropertyValue('--scale') || 1), i = ZOOMS.findIndex(z => Math.abs(z - cur) < .01), n = ZOOMS[(i + 1) % ZOOMS.length]; document.documentElement.style.setProperty('--scale', n); try{ localStorage.setItem('g11-zoom', n); }catch(e){} };

// ---------- Library ----------
function listActs(){
  const q = st.q.trim().toLowerCase(); let n = 0;
  const html = UNITS.filter(u => st.unit === 'all' || +st.unit === u.n).map(u => {
    const acts = ACTS.filter(a => a.unit === u.n && (!st.labOnly || a.lab) && (!q || [a.n, a.t.en, a.t.ta].join(' ').toLowerCase().includes(q))); n += acts.length; if(!acts.length) return '';
    return `<h2 class="unit" style="background:${u.color}"><b>${u.n}</b> ${esc(u.title[LANG])}<small>${acts.length}</small></h2><div class="agrid">${acts.map(a => `<a class="acard" href="#/a/${a.n}"><span class="num">${a.n}</span><div><h3>${esc(a.t[LANG])}</h3><div class="meta"><span class="tag">${t(KINDS[a.k])}</span>${pageTag(a.id)}${a.lab ? `<span class="tag v">${t('a.virtual')}</span>` : ''}</div></div></a>`).join('')}</div>`; }).join('');
  $('alist').innerHTML = html || `<p class="empty">${t('f.none')}</p>`; $('acount').textContent = t('f.count', { n });
}
function viewLibrary(){
  document.title = 'Lab Guide G11 · Grade 11 Science';
  app.innerHTML = `<h1>${t('lib.h')}</h1><p class="lead">${t('lib.lead')}</p><div class="filters"><b>${t('f.unit')}:</b><div class="chips" id="uChips">${['all', ...UNITS.map(u => u.n)].map(u => `<button data-u="${u}" class="${String(st.unit) === String(u) ? 'on' : ''}" aria-pressed="${String(st.unit) === String(u)}">${u === 'all' ? t('f.all') : u}</button>`).join('')}</div><input type="search" id="q" placeholder="${esc(t('f.search'))}" value="${esc(st.q)}" aria-label="${esc(t('f.search'))}"><label class="opt"><input type="checkbox" id="labOnly" ${st.labOnly ? 'checked' : ''} style="width:1.2rem;height:1.2rem;accent-color:var(--green)"> ${t('f.lab')}</label><span class="note" id="acount"></span></div><div id="alist"></div>`;
  listActs();
  $('uChips').onclick = e => { const b = e.target.closest('[data-u]'); if(!b) return; st.unit = b.dataset.u; viewLibrary(); };
  $('q').oninput = e => { st.q = e.target.value; listActs(); }; $('labOnly').onchange = e => { st.labOnly = e.target.checked; listActs(); };
}

// ---------- Activity page ----------
function refPanel(a){
  const own = getRef(a.id, LANG) || {};
  return `<details class="card refdetails" id="refcard"><summary>${t('r.edit')} <span class="note" style="margin-left:.5rem">${t('m.' + LANG)}</span></summary><p class="note">${t('r.help')}</p><div class="refform">
    <label>${t('r.book')}<input type="text" id="rBook" maxlength="80" value="${esc(own.book || '')}"></label><label>${t('r.edition')}<input type="text" id="rEd" maxlength="40" value="${esc(own.edition || '')}"></label>
    <label>${t('r.pages')}<input type="text" id="rPg" maxlength="40" value="${esc(own.pages || '')}"></label><label>${t('r.extra')}<input type="text" id="rEx" maxlength="40" value="${esc(own.extra || '')}"></label></div>
    <label class="opt"><input type="checkbox" id="rVer" ${own.verified ? 'checked' : ''} style="width:1.3rem;height:1.3rem;accent-color:var(--green)"> ${t('r.chk')}</label>
    <div class="simbar"><button class="btn" id="rSave">${t('r.save')}</button><button class="btn ghost" id="rCopy">${t('r.copy')}</button></div><p class="status" id="rMsg" role="status"></p></details>`;
}
const formRef = () => ({ book: clean($('rBook').value, 80), edition: clean($('rEd').value, 40), pages: clean($('rPg').value, 40, true), extra: clean($('rEx').value, 40, true), verified: $('rVer').checked });
function viewActivity(num){
  const a = ACTS.find(x => x.n === num); if(!a){ app.innerHTML = `<button class="back" onclick="location.hash='#/'">${t('p.back')}</button><p class="empty">${t('notfound')}</p>`; return; }
  const u = UNITS[a.unit - 1], s = shownRef(a.id); document.title = `${t('a.act')} ${a.n} · Lab Guide G11`;
  const pg = s ? `<div class="refbox"><span class="bigpage">${esc(s.r.pages)}</span><span><b>${t('r.title')}</b> · ${s.r.verified ? `<span class="badge ok">${t('r.verified')}</span>` : `<span class="badge no">${t('r.unverified')}</span>`}<br><span class="note">${s.fallback ? t('r.en.fallback') : t('r.src.ta')}</span></span></div>` : `<p class="note">${t('r.none')}</p>`;
  app.innerHTML = `<button class="back" id="back">${t('p.back')}</button>
  <div class="phead"><h1>${t('a.act')} ${a.n}: ${esc(a.t[LANG])}</h1>${a.lab ? `<div class="acts"><button class="btn" id="goPresent">${t('p.present')}</button><button class="btn ghost" id="goPrint">${t('p.print')}</button></div>` : ''}</div>
  <div class="meta"><span class="tag" style="background:${u.color}">${t('f.unit')} ${u.n}: ${esc(u.title[LANG])}</span><span class="tag">${t(KINDS[a.k])}</span></div>
  ${a.chk ? `<p class="note noteline">ⓘ ${t('a.chk')}</p>` : ''}
  <div class="infogrid"><section class="card"><h2>${t('r.title')}</h2>${pg}</section><div>${a.goal ? `<div class="goal">🎯 <span>${esc(a.goal[LANG])}</span></div>` : ''}${a.lab ? '' : `<section class="card"><p class="note">${t('a.nolab')}</p></section>`}</div></div>
  ${a.lab ? `<section class="card lab simhost"><h2>${t('a.virtual')}</h2><div id="simroot"></div></section>` : ''}${refPanel(a)}`;
  $('back').onclick = () => { location.hash = '#/'; }; if($('goPresent')){ $('goPresent').onclick = () => present(true); $('goPrint').onclick = () => window.print(); }
  $('rSave').onclick = () => { const l = localRefs(); l[a.id] = l[a.id] || {}; l[a.id][LANG] = formRef(); try{ localStorage.setItem('g11-refs', JSON.stringify(l)); $('rMsg').textContent = t('r.saved'); }catch(e){ $('rMsg').textContent = t('r.copyfail'); } };
  $('rCopy').onclick = async () => { const o = {}; ['ta', 'en'].forEach(m => { const r = m === LANG ? formRef() : getRef(a.id, m); if(r && (r.pages || r.book)) o[m] = r; }); try{ await navigator.clipboard.writeText(JSON.stringify({ [a.id]: o }, null, 2).slice(1, -1).trim() + ','); $('rMsg').textContent = t('r.copied'); }catch(e){ $('rMsg').textContent = t('r.copyfail'); } };
  if(a.lab && Labs[a.lab]) st.sim = Labs[a.lab]($('simroot'), a.pre || {});
}
function present(on){ st.present = on; document.body.classList.toggle('present', on); $('pbar').hidden = !on; const r = document.documentElement.requestFullscreen; if(on && r){ try{ Promise.resolve(r.call(document.documentElement)).catch(() => {}); }catch(e){} } else if(!on && document.fullscreenElement){ document.exitFullscreen().catch(() => {}); } }
$('pExit').onclick = () => present(false);
document.addEventListener('keydown', e => { if(e.key === 'Escape' && st.present) present(false); });
document.addEventListener('fullscreenchange', () => { if(!document.fullscreenElement && st.present) present(false); });

// ---------- About and router ----------
function viewAbout(){
  document.title = t('about.h') + ' · Lab Guide G11';
  app.innerHTML = `<button class="back" id="back">${t('p.back')}</button><div class="about"><h1>${t('about.h')}</h1><p>${t('about.p1')}</p><p>${t('about.p2')}</p><p>${t('about.p3')}</p><p>${t('about.p4')} <a href="https://e-thaksalawa.moe.gov.lk" target="_blank" rel="noopener">e-thaksalawa.moe.gov.lk</a> · <a href="https://www.edupub.gov.lk" target="_blank" rel="noopener">edupub.gov.lk</a></p></div>`; $('back').onclick = () => { location.hash = '#/'; };
}
function route(){
  if(st.sim && st.sim.destroy) st.sim.destroy(); st.sim = null; if(st.present) present(false);
  const h = location.hash.replace(/^#\/?/, ''), m = h.match(/^a\/(\d{1,2})[.-](\d{1,2})$/);
  if(m) viewActivity(`${m[1]}.${m[2]}`); else if(h === 'about') viewAbout(); else viewLibrary(); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => { route(); try{ app.focus({ preventScroll: true }); }catch(e){} });
if('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && window.isSecureContext) navigator.serviceWorker.register('sw.js').catch(() => {});
chrome(); route();