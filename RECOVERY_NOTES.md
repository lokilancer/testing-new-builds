# Recovery notes

This folder was reconstructed from the Claude conversation export for **Lab Guide LK**.

## Included
- App shell, styles, language content, practical data and seven interactive simulations
- Textbook reference editor and reference data structure
- Offline service worker, PWA manifest and SVG logo
- Validation script and PDF activity-page candidate finder

## Checks
- `node tools/validate.js`: all 7 practicals have English, Sinhala and Tamil content, and their simulation references are present.
- Main JavaScript files pass `node --check`.
- `tools/find_activities.py` passes Python bytecode compilation.

## Limitations
- Original PNG app icons were absent; the manifest and HTML now use the recovered SVG logo.
- Textbook page numbers are not pre-filled. Verify references against the exact textbook edition.
- Grade placements are suggestions; translations need subject-teacher review.
- Software checks are not official curriculum approval.

## Run locally
Run `python -m http.server 8000` in this folder and open `http://localhost:8000`.
