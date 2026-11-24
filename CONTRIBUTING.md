# Contributing to Lab Guide LK

Thank you for helping teachers. The most valuable contributions are **verified page numbers**, **translation review** and **new practicals**.

## 1. Add textbook page numbers

1. Run the site, open a practical and choose your medium (සිංහල / தமிழ் / English).
2. Fill the **Textbook reference** card from your own book: title, edition or year, exercise pages and extra-activity pages.
3. Tick **I checked these in the textbook** only if you have really looked at the printed page.
4. Press **Copy for GitHub** and paste the result into `data/refs.js` inside `window.REFS = { ... }`.
5. Open a pull request. Say which book, grade, medium and edition you used.

Rules: never invent or guess a number; if an edition differs, add a note in the pull request. Use the number printed on the page, not the PDF viewer's page counter.

`python3 tools/find_activities.py book.pdf --medium si` lists candidate pages in an official PDF (needs `pip install pypdf`).

## 2. Review the Sinhala and Tamil wording

Check `js/i18n.js` and `js/data.js` against current NIE terminology and the wording used in the textbooks (for example the Tamil terms for mass, potential difference and resistance). Fix anything unclear and mention the textbook term you matched. Keep sentences short; students read these on a projector.

## 3. Add a practical

Copy an entry in `js/data.js` and fill **every** field in **all three languages**. The lists (`materials`, `safety`, `steps`, `observe`, `questions`, `extra`) must have the same number of items in each language.

```js
{ id: 'my-practical', grades: [8], mins: 30, sim: 'optional-lab-id',
  tag: L('Topic', 'සිංහල', 'தமிழ்'), title: L('…', '…', '…'), aim: L('…', '…', '…'),
  materials: L(['…'], ['…'], ['…']), safety: L(['…'], ['…'], ['…']), steps: L(['…'], ['…'], ['…']),
  observe: L(['…'], ['…'], ['…']), conclude: L('…', '…', '…'), questions: L(['…'], ['…'], ['…']), extra: L(['…'], ['…'], ['…']) }
```

Then run `node tools/validate.js`. It fails if a language is missing or a list is out of step.

## 4. Add a virtual lab

Add `LabSims.my_lab = root => { …; return { destroy() {} }; }` in `js/sims.js`, using `T('English', 'සිංහල', 'தமிழ்')` for every label. Use the real physics or chemistry, keep it simple, and say in the practical's text what the model leaves out. Do not use images or code taken from elsewhere.

## What not to contribute

- Textbook text, pictures, diagrams or exam papers (they are copyrighted).
- Page numbers you have not checked.
- Anything that implies this is an official Ministry or NIE product.
