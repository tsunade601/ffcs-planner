# FFCS Planner - VIT Timetable Builder

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, user-friendly timetable builder for VIT University's FFCS (Fully Flexible Credit System). Plan your semester courses with real-time conflict detection and export your schedule as a PNG image.

![FFCS Planner Preview](preview.png)

## ✨ Features

- **🎯 Smart Conflict Detection**: Automatically detects and prevents scheduling conflicts between courses
- **🔍 Advanced Search**: Filter courses by code, title, faculty name, or slot
- **📊 Type Filtering**: Quickly filter between Theory and Lab courses
- **💾 Auto-Save**: Your selections are automatically saved in browser storage
- **📤 Export to PNG**: Download your timetable as a high-quality PNG image
- **🎨 Modern UI**: Clean, dark-themed interface with smooth animations
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **⌨️ Keyboard Shortcuts**: Press `Ctrl+F` to quickly focus on the search bar

## 🚀 Quick Start

1. **Clone or Download** this repository
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari)
3. **Start Building** your timetable!

No installation or server required - runs entirely in your browser!

## 📖 How to Use

### Adding Courses
1. Use the search bar to find courses by code, title, faculty, or slot
2. Optionally filter by course type (All/Theory/Lab)
3. Click on any course card to add it to your timetable
4. If there's a slot conflict, you'll be notified immediately

### Managing Courses
- View all added courses in the "Added Courses" section
- Remove any course by clicking the × button
- Your selections persist even after closing the browser

### Exporting
- Click the "Export" button to download your timetable as PNG
- Share your schedule with friends or save for reference

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Custom styles with Tailwind CSS utility classes
- **JavaScript (ES6+)** - Core functionality
- **Tailwind CSS** - Rapid UI development via CDN
- **Font Awesome** - Beautiful icons
- **html2canvas** - PNG export functionality
- **LocalStorage API** - Persistent data storage

## 📁 Project Structure

```
ffcs-planner/
├── index.html          # Main HTML file
├── script.js           # JavaScript logic
├── styles.css          # Custom CSS styles
├── data/
│   └── data.json       # Course database
└── README.md           # This file
```

## 🔧 Customization

### Adding More Courses
Edit `data/data.json` to add or modify courses. Each course should have:
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

### Modifying Slot Timings
Update the `SLOT_MAP` object in `script.js` to change slot timings according to your campus schedule.

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Safari  | 14+     | ✅ Full |

## 💡 Tips

- Plan your theory and lab slots carefully to avoid conflicts
- Use the filter buttons to quickly browse Theory or Lab courses
- The timetable grid shows both morning (8 AM - 12:30 PM) and afternoon (2 PM - 6:30 PM) slots
- Lunch break is automatically accounted for in the schedule

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 🙏 Acknowledgments

- VIT University for the FFCS system
- All contributors who helped improve this tool

---

Made with ❤️ for VIT students
