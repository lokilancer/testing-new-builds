# Lab Guide LK

An unofficial, multilingual teaching aid for science practicals in Sri Lanka. It provides clear step-by-step practical guides and simplified virtual labs in **Sinhala, Tamil and English**.

## Features

- Practical library with grade filters and search (Grades 6–11)
- Projector-friendly Teach mode with step-by-step navigation
- Seven simplified virtual labs:
  - Static electricity with a balloon
  - Acid–base indicators
  - Food tests
  - Simple electric circuits
  - Osmosis in potato strips
  - Ohm's law
  - Simple pendulum
- Local textbook-reference editor (page numbers are not pre-filled)
- Print-friendly practical sheets
- Offline/PWA support
- Day/night theme and adjustable text size

## Run locally

Once the source files are in this repository, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

No build step or external JavaScript dependencies are required.

## Important content notes

- Suggested grade placements must be checked against the current NIE syllabus.
- Tamil and Sinhala wording is draft content and should be reviewed by subject teachers.
- Textbook page references must be verified against the exact textbook edition before being marked verified.
- Virtual labs are simplified teaching models, not replacements for supervised practical work.
- This project is an unofficial teaching aid and is not affiliated with the Ministry of Education or the National Institute of Education.

## Recovery status

The source was reconstructed from a Claude conversation export. The recovered package includes the application, styles, multilingual practical data, seven simulations, reference editor, service worker, manifest, logo, and validation tools. The original PNG app icons were missing; the manifest was adjusted to use the recovered SVG logo.

The project validation script reports 7 practicals and 7 simulations, with all practical content present in English, Sinhala and Tamil. This is a structural/software check, not official curriculum approval.

## Licences

The recovered project documentation identifies the original explanatory text as CC BY 4.0 and the code as MIT. See the LICENSE file once it is added to this repository.
