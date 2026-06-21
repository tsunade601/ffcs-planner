// FFCS Planner - Complete Working Version
let allCourses = [];
let selectedCourses = [];
let currentFilter = '';

// VIT FFCS Slot Timings (based on official VIT slot chart)
// Format: each slot maps to array of {day, start, end} occurrences
const SLOT_MAP = {
    // ===== THEORY SLOTS (Morning) =====
    'A1': [
        {day: 'Mon', start: '08:00', end: '08:50'},
        {day: 'Wed', start: '09:00', end: '09:50'}
    ],
    'B1': [
        {day: 'Tue', start: '08:00', end: '08:50'},
        {day: 'Thu', start: '09:00', end: '09:50'}
    ],
    'C1': [
        {day: 'Wed', start: '08:00', end: '08:50'},
        {day: 'Fri', start: '09:00', end: '09:50'}
    ],
    'D1': [
        {day: 'Thu', start: '08:00', end: '08:50'},
        {day: 'Mon', start: '10:00', end: '10:50'}
    ],
    'E1': [
        {day: 'Fri', start: '08:00', end: '08:50'},
        {day: 'Tue', start: '10:00', end: '10:50'}
    ],
    'F1': [
        {day: 'Mon', start: '09:00', end: '09:50'},
        {day: 'Wed', start: '10:00', end: '10:50'}
    ],
    'G1': [
        {day: 'Tue', start: '09:00', end: '09:50'},
        {day: 'Thu', start: '10:00', end: '10:50'}
    ],

    // ===== THEORY SLOTS (Afternoon) =====
    'A2': [
        {day: 'Mon', start: '14:00', end: '14:50'},
        {day: 'Wed', start: '15:00', end: '15:50'}
    ],
    'B2': [
        {day: 'Tue', start: '14:00', end: '14:50'},
        {day: 'Thu', start: '15:00', end: '15:50'}
    ],
    'C2': [
        {day: 'Wed', start: '14:00', end: '14:50'},
        {day: 'Fri', start: '15:00', end: '15:50'}
    ],
    'D2': [
        {day: 'Thu', start: '14:00', end: '14:50'},
        {day: 'Mon', start: '16:00', end: '16:50'}
    ],
    'E2': [
        {day: 'Fri', start: '14:00', end: '14:50'},
        {day: 'Tue', start: '16:00', end: '16:50'}
    ],
    'F2': [
        {day: 'Mon', start: '15:00', end: '15:50'},
        {day: 'Wed', start: '16:00', end: '16:50'}
    ],
    'G2': [
        {day: 'Tue', start: '15:00', end: '15:50'},
        {day: 'Thu', start: '16:00', end: '16:50'}
    ],

    // ===== TUTORIAL SLOTS (Morning) =====
    'TA1': [
        {day: 'Fri', start: '10:00', end: '10:50'}
    ],
    'TB1': [
        {day: 'Mon', start: '11:00', end: '11:50'}
    ],
    'TC1': [
        {day: 'Tue', start: '11:00', end: '11:50'}
    ],
    'TD1': [
        {day: 'Wed', start: '11:00', end: '11:50'}
    ],
    'TE1': [
        {day: 'Thu', start: '11:00', end: '11:50'}
    ],
    'TF1': [
        {day: 'Fri', start: '11:00', end: '11:50'}
    ],
    'TG1': [
        {day: 'Mon', start: '12:00', end: '12:50'}
    ],
    'TAA1': [
        {day: 'Tue', start: '12:00', end: '12:50'}
    ],

    // ===== TUTORIAL SLOTS (Afternoon) =====
    'TA2': [
        {day: 'Fri', start: '16:00', end: '16:50'}
    ],
    'TB2': [
        {day: 'Mon', start: '17:00', end: '17:50'}
    ],
    'TC2': [
        {day: 'Tue', start: '17:00', end: '17:50'}
    ],
    'TD2': [
        {day: 'Wed', start: '17:00', end: '17:50'}
    ],
    'TE2': [
        {day: 'Thu', start: '17:00', end: '17:50'}
    ],
    'TF2': [
        {day: 'Fri', start: '17:00', end: '17:50'}
    ],
    'TG2': [
        {day: 'Mon', start: '18:00', end: '18:50'}
    ],
    'TAA2': [
        {day: 'Tue', start: '18:00', end: '18:50'}
    ],

    // ===== LAB SLOTS (Morning) =====
    'L1':  [{day: 'Mon', start: '08:00', end: '08:50'}],
    'L2':  [{day: 'Mon', start: '09:00', end: '09:50'}],
    'L3':  [{day: 'Mon', start: '10:00', end: '10:50'}],
    'L4':  [{day: 'Mon', start: '11:00', end: '11:50'}],
    'L5':  [{day: 'Mon', start: '12:00', end: '12:50'}],
    'L6':  [{day: 'Tue', start: '08:00', end: '08:50'}],
    'L7':  [{day: 'Tue', start: '09:00', end: '09:50'}],
    'L8':  [{day: 'Tue', start: '10:00', end: '10:50'}],
    'L9':  [{day: 'Tue', start: '11:00', end: '11:50'}],
    'L10': [{day: 'Tue', start: '12:00', end: '12:50'}],
    'L11': [{day: 'Wed', start: '08:00', end: '08:50'}],
    'L12': [{day: 'Wed', start: '09:00', end: '09:50'}],
    'L13': [{day: 'Wed', start: '10:00', end: '10:50'}],
    'L14': [{day: 'Wed', start: '11:00', end: '11:50'}],
    'L15': [{day: 'Wed', start: '12:00', end: '12:50'}],
    'L16': [{day: 'Thu', start: '08:00', end: '08:50'}],
    'L17': [{day: 'Thu', start: '09:00', end: '09:50'}],
    'L18': [{day: 'Thu', start: '10:00', end: '10:50'}],
    'L19': [{day: 'Thu', start: '11:00', end: '11:50'}],
    'L20': [{day: 'Thu', start: '12:00', end: '12:50'}],
    'L21': [{day: 'Fri', start: '08:00', end: '08:50'}],
    'L22': [{day: 'Fri', start: '09:00', end: '09:50'}],
    'L23': [{day: 'Fri', start: '10:00', end: '10:50'}],
    'L24': [{day: 'Fri', start: '11:00', end: '11:50'}],
    'L25': [{day: 'Fri', start: '12:00', end: '12:50'}],

    // ===== LAB SLOTS (Afternoon) =====
    'L26': [{day: 'Mon', start: '14:00', end: '14:50'}],
    'L27': [{day: 'Mon', start: '15:00', end: '15:50'}],
    'L28': [{day: 'Mon', start: '16:00', end: '16:50'}],
    'L29': [{day: 'Mon', start: '17:00', end: '17:50'}],
    'L30': [{day: 'Mon', start: '18:00', end: '18:50'}],
    'L31': [{day: 'Tue', start: '14:00', end: '14:50'}],
    'L32': [{day: 'Tue', start: '15:00', end: '15:50'}],
    'L33': [{day: 'Tue', start: '16:00', end: '16:50'}],
    'L34': [{day: 'Tue', start: '17:00', end: '17:50'}],
    'L35': [{day: 'Tue', start: '18:00', end: '18:50'}],
    'L36': [{day: 'Wed', start: '14:00', end: '14:50'}],
    'L37': [{day: 'Wed', start: '15:00', end: '15:50'}],
    'L38': [{day: 'Wed', start: '16:00', end: '16:50'}],
    'L39': [{day: 'Wed', start: '17:00', end: '17:50'}],
    'L40': [{day: 'Wed', start: '18:00', end: '18:50'}],
    'L41': [{day: 'Thu', start: '14:00', end: '14:50'}],
    'L42': [{day: 'Thu', start: '15:00', end: '15:50'}],
    'L43': [{day: 'Thu', start: '16:00', end: '16:50'}],
    'L44': [{day: 'Thu', start: '17:00', end: '17:50'}],
    'L45': [{day: 'Thu', start: '18:00', end: '18:50'}],
    'L46': [{day: 'Fri', start: '14:00', end: '14:50'}],
    'L47': [{day: 'Fri', start: '15:00', end: '15:50'}],
    'L48': [{day: 'Fri', start: '16:00', end: '16:50'}],
    'L49': [{day: 'Fri', start: '17:00', end: '17:50'}],
    'L50': [{day: 'Fri', start: '18:00', end: '18:50'}],
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const TIME_LABELS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

// Color palette for courses
const COLORS = [
    'from-indigo-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-fuchsia-500 to-violet-600',
    'from-lime-500 to-green-600',
    'from-red-500 to-orange-600',
    'from-sky-500 to-indigo-600',
    'from-yellow-500 to-amber-600',
    'from-violet-500 to-purple-600',
    'from-teal-500 to-cyan-600',
];

function getCourseColor(index) {
    return COLORS[index % COLORS.length];
}

async function loadCourses() {
    try {
        const res = await fetch('data/data.json');
        const data = await res.json();
        allCourses = Array.isArray(data) ? data : (data.courses || []);
        renderCourseList();
    } catch(e) {
        console.error('Failed to load courses:', e);
        document.getElementById('courseList').innerHTML = `
            <div class="text-red-400 text-center py-8">
                <i class="fas fa-exclamation-triangle text-2xl mb-2 block"></i>
                <p>Failed to load courses.</p>
                <p class="text-sm text-gray-500 mt-1">Make sure data/data.json exists</p>
            </div>`;
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
        const searchText = `${course.code} ${course.title || ''} ${course.faculty || ''} ${course.slot || ''}`.toLowerCase();
        return searchText.includes(currentFilter);
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-8">No matching courses found.</p>`;
        return;
    }

    filtered.forEach(course => {
        const isAdded = selectedCourses.some(c => c.code === course.code);
        const div = document.createElement('div');
        div.className = `bg-gray-800 rounded-2xl p-4 transition cursor-pointer border border-transparent hover:border-indigo-500/50 ${isAdded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`;
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="font-mono text-indigo-400 text-sm font-bold">${course.code}</div>
                <span class="text-xs bg-gray-700 px-2.5 py-1 rounded-lg text-gray-300 font-mono">${course.slot || 'N/A'}</span>
            </div>
            <div class="font-semibold mt-1 text-sm text-gray-100">${course.title || 'Untitled'}</div>
            <div class="flex justify-between items-center mt-2.5 text-xs text-gray-400">
                <span><i class="fas fa-user-tie mr-1.5 text-gray-500"></i>${course.faculty || 'TBA'}</span>
                <span class="text-emerald-400 font-mono font-semibold">${course.credits || 0} cr</span>
            </div>
            ${isAdded ? '<div class="mt-2 text-xs text-amber-400"><i class="fas fa-check-circle mr-1"></i>Already added</div>' : ''}
        `;
        if (!isAdded) {
            div.onclick = () => addCourse(course);
        }
        container.appendChild(div);
    });
}

function parseSlots(slotString) {
    if (!slotString) return [];
    // Handle combined slots like "A1+TA1", "L1+L2", "A1+TA1+L1"
    return slotString.split(/[+]/).map(s => s.trim()).filter(s => s);
}

function getSlotTimings(slotString) {
    const slots = parseSlots(slotString);
    const timings = [];
    slots.forEach(slot => {
        if (SLOT_MAP[slot]) {
            SLOT_MAP[slot].forEach(t => timings.push({...t, slotName: slot}));
        }
    });
    return timings;
}

function timeToRow(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 8 * 60; // 08:00 = row 0
    return Math.floor((totalMinutes - startMinutes) / 60);
}

function dayToCol(day) {
    return DAYS.indexOf(day);
}

function checkConflict(course) {
    const newTimings = getSlotTimings(course.slot);
    if (newTimings.length === 0) return null;

    for (const selected of selectedCourses) {
        const existingTimings = getSlotTimings(selected.slot);
        for (const newT of newTimings) {
            for (const existT of existingTimings) {
                if (newT.day === existT.day && newT.start === existT.start) {
                    return {
                        course: selected,
                        day: newT.day,
                        time: newT.start,
                        slot: newT.slotName
                    };
                }
            }
        }
    }
    return null;
}

function addCourse(course) {
    // Check if already added
    if (selectedCourses.some(c => c.code === course.code)) {
        showToast('Course already added!', 'warning');
        return;
    }

    // Check for slot conflicts
    const conflict = checkConflict(course);
    if (conflict) {
        showToast(
            `Conflict: ${course.code} (${conflict.slot}) clashes with ${conflict.course.code} on ${conflict.day} at ${conflict.time}`,
            'error',
            5000
        );
        return;
    }

    selectedCourses.push({...course, colorIndex: selectedCourses.length});
    saveToLocal();
    renderTimetable();
    renderSelectedCourses();
    renderCourseList();
    updateStats();
    showToast(`${course.code} added successfully!`, 'success');
}

function removeCourse(index) {
    const removed = selectedCourses.splice(index, 1)[0];
    // Reassign colors
    selectedCourses.forEach((c, i) => c.colorIndex = i);
    saveToLocal();
    renderTimetable();
    renderSelectedCourses();
    renderCourseList();
    updateStats();
    showToast(`${removed.code} removed`, 'info');
}

function renderTimetable() {
    const container = document.getElementById('timetable');

    // Build grid: header row + time rows
    let html = '';

    // Header row
    html += `<div class="time-slot p-3 font-mono text-xs font-bold">TIME</div>`;
    DAYS.forEach(day => {
        html += `<div class="day-header p-3 text-center">${day}</div>`;
    });

    // Time rows
    TIME_SLOTS.forEach((time, i) => {
        html += `<div class="time-slot p-3 font-mono text-xs">${TIME_LABELS[i]}</div>`;
        DAYS.forEach(day => {
            html += `<div class="cell" data-day="${day}" data-time="${time}"></div>`;
        });
    });

    container.innerHTML = html;

    // Place courses in correct cells
    selectedCourses.forEach((course, courseIdx) => {
        const timings = getSlotTimings(course.slot);
        timings.forEach(timing => {
            const col = dayToCol(timing.day);
            const row = timeToRow(timing.start);
            if (col >= 0 && row >= 0 && row < TIME_SLOTS.length) {
                const cells = container.querySelectorAll('.cell');
                const cell = cells[row * 5 + col];
                if (cell) {
                    const colorClass = getCourseColor(courseIdx);
                    cell.innerHTML = `
                        <div class="course-slot bg-gradient-to-br ${colorClass} text-white p-2 text-xs rounded-lg h-full flex flex-col justify-center cursor-pointer group" title="${course.title}\nFaculty: ${course.faculty}\nSlot: ${course.slot}\nCredits: ${course.credits}">
                            <div class="font-bold truncate text-11px">${course.code}</div>
                            <div class="text-10px opacity-80 truncate">${timing.slotName}</div>
                            <div class="text-9px opacity-60 truncate mt-0.5 hidden group-hover:block">${course.faculty}</div>
                        </div>
                    `;
                }
            }
        });
    });
}

function renderSelectedCourses() {
    const container = document.getElementById('selectedCourses');
    if (selectedCourses.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-search text-3xl mb-3 text-gray-700"></i>
                <p>No courses added yet.</p>
                <p class="text-sm mt-1">Search and click on a course to add it to your timetable.</p>
            </div>`;
        return;
    }

    container.innerHTML = selectedCourses.map((course, idx) => {
        const colorClass = getCourseColor(idx);
        const timings = getSlotTimings(course.slot);
        const daysList = [...new Set(timings.map(t => t.day))].join(', ');

        return `
            <div class="bg-gray-800 rounded-2xl p-4 flex justify-between items-center border border-gray-700 hover:border-gray-600 transition group">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-3 h-12 rounded-full bg-gradient-to-b ${colorClass} shrink-0"></div>
                    <div class="min-w-0">
                        <div class="font-mono text-indigo-400 text-sm font-bold">${course.code}</div>
                        <div class="font-semibold text-sm text-gray-100 truncate">${course.title || 'Untitled'}</div>
                        <div class="text-xs text-gray-400 mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                            <span><i class="fas fa-user-tie mr-1 text-gray-500"></i>${course.faculty || 'TBA'}</span>
                            <span><i class="fas fa-clock mr-1 text-gray-500"></i>${course.slot || 'N/A'}</span>
                            <span><i class="fas fa-calendar mr-1 text-gray-500"></i>${daysList || 'N/A'}</span>
                            <span class="text-emerald-400 font-mono font-semibold">${course.credits || 0} cr</span>
                        </div>
                    </div>
                </div>
                <button onclick="removeCourse(${idx})" 
                        class="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-500 hover:text-white text-gray-400 flex items-center justify-center transition shrink-0 ml-2"
                        title="Remove course">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const totalCredits = selectedCourses.reduce((sum, c) => sum + (parseInt(c.credits) || 0), 0);
    const theoryCount = selectedCourses.filter(c => (c.type || '').toLowerCase().includes('theory')).length;
    const labCount = selectedCourses.filter(c => (c.type || '').toLowerCase().includes('lab')).length;
    const otherCount = selectedCourses.length - theoryCount - labCount;

    let html = `
        <span class="bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-xs font-medium border border-indigo-500/30">
            <i class="fas fa-book mr-1"></i>${selectedCourses.length} Courses
        </span>
        <span class="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-500/30">
            <i class="fas fa-award mr-1"></i>${totalCredits} Credits
        </span>
    `;

    if (theoryCount > 0) {
        html += `<span class="bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full text-xs font-medium">${theoryCount} Theory</span>`;
    }
    if (labCount > 0) {
        html += `<span class="bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full text-xs font-medium">${labCount} Lab</span>`;
    }
    if (otherCount > 0) {
        html += `<span class="bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full text-xs font-medium">${otherCount} Other</span>`;
    }

    document.getElementById('stats').innerHTML = html;
}

function saveToLocal() {
    localStorage.setItem('ffcs_timetable_v2', JSON.stringify(selectedCourses));
}

function loadFromLocal() {
    const saved = localStorage.getItem('ffcs_timetable_v2');
    if (saved) {
        try {
            selectedCourses = JSON.parse(saved);
            selectedCourses.forEach((c, i) => c.colorIndex = i);
        } catch(e) {
            selectedCourses = [];
        }
    }
}

function clearTimetable() {
    if (selectedCourses.length === 0) return;
    if (confirm('Are you sure you want to clear all courses from your timetable?')) {
        selectedCourses = [];
        saveToLocal();
        renderTimetable();
        renderSelectedCourses();
        renderCourseList();
        updateStats();
        showToast('Timetable cleared', 'info');
    }
}

async function exportTimetable() {
    const timetableEl = document.getElementById('timetable');

    try {
        const canvas = await html2canvas(timetableEl, {
            backgroundColor: '#27272a',
            scale: 2,
            useCORS: true,
            logging: false
        });

        const link = document.createElement('a');
        link.download = `FFCS_Timetable_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Timetable exported as PNG!', 'success');
    } catch(e) {
        console.error('Export failed:', e);
        showToast('Export failed. Please try again.', 'error');
    }
}

function showToast(message, type = 'info', duration = 3000) {
    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-indigo-500'
    };
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };

    // Remove existing toasts
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification fixed bottom-6 right-6 ${colors[type]} text-white px-6 py-3.5 rounded-2xl shadow-2xl transform translate-y-20 opacity-0 transition-all duration-300 z-50 flex items-center gap-3 font-medium`;
    toast.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-20', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.toast-notification').forEach(t => t.remove());
    }
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadFromLocal();
    loadCourses().then(() => {
        renderTimetable();
        renderSelectedCourses();
        updateStats();
    });
});