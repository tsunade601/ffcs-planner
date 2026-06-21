// FFCS Planner Core Logic - Fresh Implementation inspired by original slot-based system

let allCourses = [];
let currentTimetable = {}; // key: slot, value: course object

// Expanded sample data for better demo
const sampleCourses = [
  {"code": "CSE1001", "title": "Problem Solving and Programming", "slot": "A1", "faculty": "Dr. Smith", "credits": 4, "type": "Theory"},
  {"code": "MAT1001", "title": "Calculus for Engineers", "slot": "B1", "faculty": "Dr. Johnson", "credits": 4, "type": "Theory"},
  {"code": "PHY1001", "title": "Physics", "slot": "C1", "faculty": "Dr. Brown", "credits": 4, "type": "Theory"},
  {"code": "EEE1001", "title": "Electrical Sciences", "slot": "D1", "faculty": "Dr. Wilson", "credits": 4, "type": "Theory"},
  {"code": "CSE1002", "title": "Digital Logic", "slot": "L1", "faculty": "Dr. Davis", "credits": 3, "type": "Lab"}
];

// VIT-like slot clash logic (simplified)
function getSlotTime(slot) {
  const timings = {
    'A1': {days: [0], time: '8-9 AM'},
    'B1': {days: [0], time: '9-10 AM'},
    'C1': {days: [0], time: '10-11 AM'},
    'D1': {days: [0], time: '11-12 AM'},
    'L1': {days: [0,2], time: '2-4 PM'}, // example
  };
  return timings[slot] || {days: [0], time: 'Unknown'};
}

function hasClash(newCourse) {
  const newSlotInfo = getSlotTime(newCourse.slot);
  for (let slot in currentTimetable) {
    const existing = currentTimetable[slot];
    if (existing.slot === newCourse.slot) {
      return true; // same slot clash
    }
    // Could extend for overlapping times
  }
  return false;
}

function addCourse(course) {
  if (hasClash(course)) {
    alert(`⚠️ Clash detected with existing course in slot ${course.slot}!`);
    return;
  }
  currentTimetable[course.slot] = course;
  renderTimetable();
  renderAddedCourses();
  saveToLocalStorage();
}

function removeCourse(slot) {
  delete currentTimetable[slot];
  renderTimetable();
  renderAddedCourses();
  saveToLocalStorage();
}

function renderCourseList(courses) {
  const container = document.getElementById('courseList');
  container.innerHTML = '';
  if (courses.length === 0) {
    container.innerHTML = '<p class="text-gray-500 p-4">No courses found.</p>';
    return;
  }
  courses.forEach(course => {
    const el = document.createElement('div');
    el.className = 'p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-indigo-400 cursor-pointer transition-all';
    el.innerHTML = `
      <div class="flex justify-between">
        <div>
          <span class="font-bold text-indigo-600">${course.code}</span>
          <span class="ml-2 text-sm text-gray-500">${course.type}</span>
        </div>
        <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">${course.slot}</span>
      </div>
      <div class="mt-1 font-medium">${course.title}</div>
      <div class="text-sm text-gray-500">${course.faculty} • ${course.credits} Credits</div>
    `;
    el.onclick = () => addCourse(course);
    container.appendChild(el);
  });
}

function renderTimetable() {
  const container = document.getElementById('timetable');
  container.innerHTML = `
    <div class="timetable-grid text-sm">
      <div class="bg-gray-100 dark:bg-gray-700 p-2 font-semibold"></div>
      ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => `<div class="day-header py-3 font-semibold bg-indigo-50 dark:bg-indigo-950 text-center">${d}</div>`).join('')}
    `;

  // Hours
  for (let h = 8; h <= 17; h++) {
    container.innerHTML += `<div class="time-slot text-right pr-2 py-4 border-t">${h}:00</div>`;
    for (let d = 0; d < 5; d++) {
      container.innerHTML += `<div class="course-slot border border-gray-100 dark:border-gray-700 min-h-[50px] flex items-center justify-center text-xs p-1" style="background: linear-gradient(135deg, #6366f1, #4f46e5);"></div>`;
    }
  }
  container.innerHTML += '</div>';

  // TODO: Place actual courses in correct positions based on slot timings
}

function renderAddedCourses() {
  const container = document.getElementById('addedCourses');
  let html = `<h3 class="text-lg font-semibold mb-3 flex items-center gap-2"><span>Selected Courses</span><span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">${Object.keys(currentTimetable).length}</span></h3>`;
  html += '<div class="space-y-3">';
  Object.entries(currentTimetable).forEach(([slot, course]) => {
    html += `
      <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-2xl border">
        <div>
          <div class="font-semibold">${course.code} — ${course.title}</div>
          <div class="text-xs text-gray-500">${course.faculty} | Slot: <span class="font-mono">${slot}</span></div>
        </div>
        <button onclick="removeCourse('${slot}')" class="px-4 py-1 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium">Remove</button>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function saveToLocalStorage() {
  localStorage.setItem('ffcsTimetable', JSON.stringify(currentTimetable));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('ffcsTimetable');
  if (saved) {
    currentTimetable = JSON.parse(saved);
  }
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}

function resetTimetable() {
  if (confirm('Clear all selected courses?')) {
    currentTimetable = {};
    renderTimetable();
    renderAddedCourses();
    localStorage.removeItem('ffcsTimetable');
  }
}

// Main init
document.addEventListener('DOMContentLoaded', function() {
  // Load data
  allCourses = sampleCourses;
  renderCourseList(allCourses);

  loadFromLocalStorage();
  renderTimetable();
  renderAddedCourses();

  // Search
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', function() {
    const query = this.value.toLowerCase().trim();
    if (!query) {
      renderCourseList(allCourses);
      return;
    }
    const filtered = allCourses.filter(course => 
      course.code.toLowerCase().includes(query) ||
      course.title.toLowerCase().includes(query) ||
      (course.faculty && course.faculty.toLowerCase().includes(query))
    );
    renderCourseList(filtered);
  });
});
