// FFCS Planner - Modern Timetable Builder
let allCourses = [];
let selectedTimetable = {}; 
let currentFilter = '';

async function loadCourses() {
    try {
        const res = await fetch('data/courses.json');
        const data = await res.json();
        allCourses = data.courses || [];
        renderCourseList();
    } catch(e) {
        console.error(e);
        document.getElementById('courseList').innerHTML = '<p class="text-red-400">Failed to load courses.</p>';
    }
}

function filterCourses() {
    currentFilter = document.getElementById('searchInput').value.toLowerCase().trim();
    renderCourseList();
}

function renderCourseList() {
    const container = document.getElementById('courseList');
    container.innerHTML = '';
    const filtered = allCourses.filter(course => {
        if (!currentFilter) return true;
        return course.code.toLowerCase().includes(currentFilter) || (course.title || '').toLowerCase().includes(currentFilter);
    });
    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-8">No matching courses.</p>`;
        return;
    }
    filtered.forEach(course => {
        const div = document.createElement('div');
        div.className = 'bg-gray-800 rounded-2xl p-4 hover:bg-gray-700 transition cursor-pointer';
        div.innerHTML = `<div class="font-mono text-indigo-400 text-sm">${course.code}</div><div class="font-semibold mt-1">${course.title}</div>`;
        div.onclick = () => showSections(course);
        container.appendChild(div);
    });
}

function showSections(course) {
    let html = `<div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onclick="this.remove()">
        <div onclick="event.stopImmediatePropagation()" class="bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
            <h3 class="text-xl font-bold mb-6">${course.code} - ${course.title}</h3>`;
    course.sections.forEach((sec, i) => {
        html += `<div onclick="addCourse('${course.code}', ${i}); this.closest('.fixed').remove()" class="bg-gray-800 hover:bg-violet-900 p-4 rounded-2xl cursor-pointer mb-3 flex justify-between">
            <div><div>${sec.slot}</div><div class="text-emerald-400 text-sm">${sec.faculty_name}</div></div><i class="fas fa-plus"></i></div>`;
    });
    html += `</div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

function addCourse(code, sectionIndex) {
    const course = allCourses.find(c => c.code === code);
    const section = course.sections[sectionIndex];
    const key = `${code}-${sectionIndex}`;
    selectedTimetable[key] = { ...course, selectedSection: section };
    saveToLocal();
    renderTimetable();
    renderSelectedCourses();
}

function removeCourse(key) {
    delete selectedTimetable[key];
    saveToLocal();
    renderTimetable();
    renderSelectedCourses();
}

function renderTimetable() {
    const container = document.getElementById('timetable');
    container.innerHTML = `<div class="time-slot p-3">Time</div><div class="day-header p-3 text-center">Mon</div><div class="day-header p-3 text-center">Tue</div><div class="day-header p-3 text-center">Wed</div><div class="day-header p-3 text-center">Thu</div><div class="day-header p-3 text-center">Fri</div>` + Array(8).fill(0).map((_,i) => `<div class="time-slot p-3">${8+i}- ${9+i}</div>` + Array(5).fill('<div class="cell p-2 border border-gray-700 rounded"></div>').join('')).join('');
    Object.keys(selectedTimetable).forEach((key, idx) => {
        const cell = container.querySelectorAll('.cell')[idx % 5];
        if (cell) cell.innerHTML = `<div class="course-card">${selectedTimetable[key].code}</div>`;
    });
}

function renderSelectedCourses() {
    const container = document.getElementById('selectedCourses');
    container.innerHTML = Object.keys(selectedTimetable).map(key => `<div class="bg-gray-800 p-4 rounded-2xl flex justify-between"><div>${selectedTimetable[key].code}</div><button onclick="removeCourse('${key}')" class="text-red-400">×</button></div>`).join('') || '<p class="text-gray-500">No courses added yet</p>';
}

function saveToLocal() { localStorage.setItem('ffcs_timetable', JSON.stringify(selectedTimetable)); }

function loadFromLocal() { const s = localStorage.getItem('ffcs_timetable'); if(s) selectedTimetable = JSON.parse(s); }

function clearTimetable() { if(confirm('Clear?')) { selectedTimetable = {}; saveToLocal(); renderTimetable(); renderSelectedCourses(); } }

async function exportTimetable() {
    const canvas = await html2canvas(document.getElementById('timetable'));
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'timetable.png';
    a.click();
}

window.onload = () => { loadFromLocal(); loadCourses().then(() => { renderTimetable(); renderSelectedCourses(); }); };