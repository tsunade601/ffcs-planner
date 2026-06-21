# FFCS Planner

**Modern VIT FFCS Timetable Builder**  
Build clash-free schedules for Vellore, Chennai & AP campuses.

![FFCS Planner](https://via.placeholder.com/800x400/4f46e5/ffffff?text=FFCS+Planner+Screenshot)

## ✨ Key Features
- **Real-time Search** across course code, title & faculty
- **Visual Timetable** with color-coded slots
- **Smart Clash Detection** based on VIT slots
- **Persistent Plans** (saved in browser)
- **Clean Dark UI** — mobile friendly
- **No Backend** — works offline

## 🚀 Quick Start
1. Clone the repo
   ```bash
   git clone https://github.com/tsunade601/ffcs-planner.git
   ```
2. Open `index.html` in your browser
3. Start searching and adding courses!

## Project Structure
```
ffcs-planner/
├── index.html          # Main interface
├── script.js           # All core logic (search, timetable, clashes)
├── styles.css          # Modern styling
├── data/
│   └── sample.json     # Demo courses (expand with real VIT data)
└── README.md
```

## How It Works (Logic Summary)
- Courses loaded from JSON (converted from VIT XLS reports)
- Slots like `A1`, `B2`, `L31` used for placement and clash checks
- Timetable rendered as a 5-day grid with hour slots
- LocalStorage for saving your plan across sessions

Inspired by the solid foundation of [vatz88/FFCSonTheGo](https://github.com/vatz88/FFCSonTheGo) but rebuilt with modern JS, Tailwind, and improved UX.

## Next Steps / Roadmap
- [ ] Full VIT slot timing database
- [ ] Export as PNG / PDF
- [ ] Campus selector (Vellore/Chennai)
- [ ] Auto timetable generator
- [ ] Faculty rating integration

Contributions welcome! Fork → PR.

**Made for VITians by a VITian** ❤️
