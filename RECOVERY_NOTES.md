# Recovery notes

The Lab Guide LK project has been reconstructed from the Claude conversation export.

The downloadable recovered source package contains the app shell, CSS, multilingual content, seven simulations, reference editor, PWA files, SVG logo, README, licence, and validation utilities.

## Verification performed

- `node tools/validate.js`: 7 practicals and 7 simulations found; all English, Sinhala and Tamil content fields are complete.
- JavaScript syntax checks passed for the main app files.
- Python compilation check passed for `tools/find_activities.py`.
- ZIP archive integrity check passed.

## Known limitations

- The original PNG icons were missing. The recovered manifest and HTML now use the SVG logo.
- Textbook page numbers are not verified or pre-filled.
- Suggested grade placements and translations require review by Sri Lankan subject teachers.
- These checks do not establish official curriculum approval.
