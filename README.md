# Dengue Care Tracker

A simple, responsive, GitHub Pages website for keeping a personal log of fluid intake, urine output and prescribed medicines.

## Features

- Daily dashboard with fluid and urine totals.
- Time-stamped fluid intake entries.
- Time-stamped urine output entries.
- Medicine name, prescribed-dose note and time-taken log.
- Date-based history.
- Export selected day's records as CSV or print a report.
- Browser-local storage; no patient account or server database.

## Privacy and limitations

This first version stores records in the browser's local storage on the current device. The records are **not uploaded to GitHub or any server**, and they do not automatically sync to another device. Anyone with access to the same unlocked browser profile may be able to view them. Avoid using a shared/public device. Clearing browser data may erase records. Export reports carefully and share them only with the intended doctor or caregiver.

GitHub Pages is static hosting. This project does not provide secure user accounts, encrypted cloud storage, multi-device sync, or a clinician portal.

## Publish with GitHub Pages

1. Open the repository: https://github.com/lokilancer/Your-health-checker
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**, then save.
5. Wait for GitHub Pages to publish the site. The Pages section will show the website URL.

## Medical safety

This is a personal record-keeping aid, not a medical device and not a substitute for professional care. It does not diagnose dengue, assess warning signs, recommend fluid amounts, or recommend medicines or doses. Follow the instructions of a qualified healthcare professional. Enter medicine details only as prescribed or approved by your clinician. If the patient becomes worse or has concerning symptoms, seek urgent medical care rather than relying on this tracker.

## Files

- `index.html` — page structure
- `styles.css` — responsive design
- `app.js` — local records, totals, CSV export and printing

No build step or package installation is required.
