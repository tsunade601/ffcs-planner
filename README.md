# FFCS Planner

**A modern, fresh FFCS timetable builder for VIT students (Vellore / Chennai / AP).**

Built from scratch with modern web tech — inspired by the logic of existing tools but completely new implementation.

## ✨ Features
- 🔍 Smart course search (code, title, faculty)
- 🕒 Visual weekly timetable grid
- ⚠️ Real-time clash detection
- 📱 Fully responsive design + Dark mode
- 💾 Saves plans in browser (localStorage - coming)
- 📤 Export timetable as image (planned)

## 🚀 Quick Start
1. Open `index.html` directly in your browser (no build needed)
2. Use the search bar to find courses
3. Click on a course to add it to your timetable
4. Resolve any slot clashes shown

## Project Structure
```
ffcs-planner/
├── index.html          # Main UI
├── script.js           # Core logic: search, timetable, clashes
├── styles.css          # Custom styles + Tailwind
├── data/
│   └── sample.json     # Sample VIT courses
└── README.md
```

## Data Pipeline (Future)
Download latest VIT FFCS reports → convert XLSX to JSON → load here.

## Tech Stack
- Vanilla JS + Tailwind CSS (via CDN)
- No heavy frameworks for simplicity and speed

## Contributing
- Improve clash detection with full VIT slot timings
- Add auto-schedule generator
- Faculty feedback integration

**Star the repo if it helps your FFCS registration!** ⭐

Inspired by (but independent of) [FFCSonTheGo](https://github.com/vatz88/FFCSonTheGo)