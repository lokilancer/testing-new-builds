const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..'), read = f => fs.readFileSync(path.join(root, f), 'utf8');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(read('js/data.js') + '\n;globalThis.__ACTS = ACTS; globalThis.__UNITS = UNITS;', ctx);
vm.runInContext(read('data/refs.js'), ctx);
const acts = ctx.__ACTS, units = ctx.__UNITS, refs = ctx.window.REFS || {};
const labs = new Set([...read('js/labs.js').matchAll(/^Labs\\.(\\w+)\\s*=/gm)].map(m => m[1]));
const errors = [];
if (acts.length !== 46) errors.push('Expected 46 activities, found ' + acts.length);
if (units.length !== 8) errors.push('Expected 8 units, found ' + units.length);
const ids = new Set();
for (const a of acts) {
  if (ids.has(a.id)) errors.push('Duplicate activity id: ' + a.id); ids.add(a.id);
  if (!a.t?.en || !a.t?.ta) errors.push(a.n + ': missing English/Tamil title');
  if (a.lab && !labs.has(a.lab)) errors.push(a.n + ': missing lab module ' + a.lab);
}
if (Object.keys(refs).length !== 8) errors.push('Expected 8 confirmed page references, found ' + Object.keys(refs).length);
for (const [id,v] of Object.entries(refs)) if (!ids.has(id) || !v.ta?.pages || v.ta.verified !== true) errors.push('Invalid page reference: ' + id);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS: ' + acts.length + ' activities, ' + units.length + ' units, ' + labs.size + ' lab modules, ' + Object.keys(refs).length + ' confirmed Tamil page references.');