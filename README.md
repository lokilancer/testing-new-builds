<p align="center"><img src="logo.svg" width="96" alt="Lab Guide LK logo"></p>

<h1 align="center">Lab Guide LK</h1>

<p align="center">
  <a href="https://lokilancer.github.io/testing-new-builds/">
    <img src="https://img.shields.io/badge/Try_it_live-Open_Lab_Guide_LK-14795b?style=for-the-badge" alt="Try Lab Guide LK live">
  </a>
</p>

<p align="center">
  Clear, visual science practicals for <b>Grades 6–11</b> in <b>Sinhala, Tamil and English</b>.<br>
  Step-by-step teaching mode for the projector, virtual labs when equipment is missing, and a place for verified textbook page numbers.
</p>

> **සිංහල:** ගුරුවරුන්ට ශ්‍රේණි 6–11 විද්‍යා ප්‍රායෝගික පැහැදිලිව පහදා දීමට උපකාරී වන, අතථ්‍ය විද්‍යාගාර සහිත, සිංහල, දෙමළ සහ ඉංග්‍රීසි මාධ්‍ය සහාය ඇති නිල නොවන ඉගැන්වීම් සහායකයකි.
>
> **தமிழ்:** ஆசிரியர்கள் தரங்கள் 6–11 விஞ்ஞானச் செய்முறைகளைத் தெளிவாக விளக்க உதவும், மெய்நிகர் ஆய்வுகூடங்களுடன் கூடிய, சிங்களம், தமிழ், ஆங்கில மொழிமூல ஆதரவுள்ள அதிகாரபூர்வமற்ற கற்பித்தல் உதவி.

## What it does

- **Practical library** filtered by grade (6–11) and searchable, in the medium you choose.
- **Teach mode**: big text, one highlighted step at a time, arrow keys or the on-screen buttons, full screen. Made for a classroom projector.
- **Virtual labs** (7 so far): static electricity, acid–base indicators, food tests, simple circuits, osmosis in potato, Ohm's law and the simple pendulum. They are simplified models for explaining the idea, not a replacement for the real practical.
- **Textbook page numbers** for the exercise and the extra activities, with a *verified* flag (see below).
- **Print sheet** for each practical, works offline once opened, and installs like an app from Chrome or Edge.

## About the page numbers (please read)

Textbook page numbers differ between editions and reprints, and the curriculum is being revised. A wrong page number wastes a teacher's time, so **no page numbers are pre-filled**. Instead:

1. A teacher opens their own textbook, finds the practical and types the page numbers into the **Textbook reference** card. They are saved on that device.
2. **Copy for GitHub** produces a ready-to-paste entry for `data/refs.js`.
3. Anyone can open a pull request. Numbers marked **verified** show a green badge for everyone.

To find candidate pages faster, `tools/find_activities.py` scans an official textbook PDF for words like "Activity" (ක්‍රියාකාරකම, செயற்பாடு) and lists the pages. It only suggests candidates; always check the printed page number. Many older PDFs use legacy fonts and cannot be searched, and the script warns you when that happens.

## Content status

| Practical | Suggested grades | Virtual lab |
|---|---|---|
| Static electricity with a balloon | 7 | yes |
| Testing acids and bases with indicators | 7–9 | yes |
| Testing foods for starch, sugar, protein and fat | 6–8 | yes |
| Building simple electric circuits | 8–9 | yes |
| Osmosis in potato strips | 9–10 | yes |
| Verifying Ohm's law | 10–11 | yes |
| Period of a simple pendulum | 10–11 | yes |

- **Grade placement is a suggestion.** Please confirm it against the current NIE syllabus and open an issue or pull request if a practical belongs in a different grade.
- **Sinhala and Tamil text is a careful draft.** A subject teacher should review it against current NIE terminology. See [CONTRIBUTING.md](CONTRIBUTING.md).
- Science is covered first. The structure supports other subjects with practical work.

## Run it

```bash
python3 -m http.server 8000   # then open http://localhost:8000
node tools/validate.js        # checks every practical is complete in all three languages
```

No build step, no dependencies. Sinhala and Tamil display uses the fonts on the device (Windows 10+, Android and recent Linux include them).

## Content and copyright

This project contains **no textbook text, pictures or diagrams**. Government textbooks belong to the Ministry of Education / Educational Publications Department of Sri Lanka and are available from [e-thaksalawa](https://e-thaksalawa.moe.gov.lk) and [edupub.gov.lk](https://www.edupub.gov.lk). Please do not copy textbook content into this repository; page numbers and your own explanations are welcome.

Lab Guide LK is an unofficial teaching aid and is not affiliated with the Ministry of Education or the National Institute of Education. The practical descriptions are original text under **CC BY 4.0**; the code is under the **MIT License**.
