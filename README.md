# FFCS Planner - VIT Timetable Builder

A static timetable planner for VIT FFCS course selection. Search courses, add one section per course, catch slot conflicts before they enter the timetable, and export the final view as a PNG.

## Features

- Course search by code, title, faculty, type, or slot
- Theory/Lab filters and sortable course list
- Conflict detection across theory, tutorial, and lab slots
- Compact and comfortable timetable views
- Selected-course panel with credits and meeting times
- Autosave with browser localStorage
- PNG export with html2canvas

## Run Locally

Because the app loads `data/data.json` with `fetch()`, run it from a local web server instead of opening `index.html` directly.

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project Structure

```text
ffcs-planner/
├── index.html
├── script.js
├── styles.css
├── data/
│   └── data.json
├── README.md
└── LICENSE
```

## Course Data

Edit `data/data.json` to add or update courses:

```json
{
  "code": "COURSE101",
  "title": "Course Title",
  "slot": "A1+TA1",
  "faculty": "Faculty Name",
  "credits": 3,
  "type": "Theory"
}
```

Slot timings are defined in `script.js` inside `SLOT_MAP`. Update that map if your campus or semester uses a different slot chart.

## License

MIT. See [LICENSE](LICENSE).
