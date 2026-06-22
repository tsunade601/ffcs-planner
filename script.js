// FFCS Planner
let allCourses = [];
let selectedCourses = [];
let currentFilter = "";
let currentTypeFilter = "all";
let currentSort = "code";
let timetableDensity = "comfortable";

const STORAGE_KEY = "ffcs_timetable_v3";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_LABELS = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
};

const GRID_ROWS = [
    { start: "08:00", end: "08:50", label: "08:00 AM - 08:50 AM" },
    { start: "09:00", end: "09:50", label: "09:00 AM - 09:50 AM" },
    { start: "10:00", end: "10:50", label: "10:00 AM - 10:50 AM" },
    { start: "11:00", end: "11:50", label: "11:00 AM - 11:50 AM" },
    { start: "12:00", end: "12:50", label: "12:00 PM - 12:50 PM" },
    { start: "BREAK", end: "", label: "Lunch Break" },
    { start: "14:00", end: "14:50", label: "02:00 PM - 02:50 PM" },
    { start: "15:00", end: "15:50", label: "03:00 PM - 03:50 PM" },
    { start: "16:00", end: "16:50", label: "04:00 PM - 04:50 PM" },
    { start: "17:00", end: "17:50", label: "05:00 PM - 05:50 PM" },
    { start: "18:00", end: "18:50", label: "06:00 PM - 06:50 PM" },
];

const SLOT_MAP = {
    A1: [{ day: "Mon", start: "08:00", end: "08:50" }, { day: "Wed", start: "09:00", end: "09:50" }],
    B1: [{ day: "Tue", start: "08:00", end: "08:50" }, { day: "Thu", start: "09:00", end: "09:50" }],
    C1: [{ day: "Wed", start: "08:00", end: "08:50" }, { day: "Fri", start: "09:00", end: "09:50" }],
    D1: [{ day: "Thu", start: "08:00", end: "08:50" }, { day: "Mon", start: "10:00", end: "10:50" }],
    E1: [{ day: "Fri", start: "08:00", end: "08:50" }, { day: "Tue", start: "10:00", end: "10:50" }],
    F1: [{ day: "Mon", start: "09:00", end: "09:50" }, { day: "Wed", start: "10:00", end: "10:50" }],
    G1: [{ day: "Tue", start: "09:00", end: "09:50" }, { day: "Thu", start: "10:00", end: "10:50" }],
    TA1: [{ day: "Fri", start: "10:00", end: "10:50" }],
    TB1: [{ day: "Mon", start: "11:00", end: "11:50" }],
    TC1: [{ day: "Tue", start: "11:00", end: "11:50" }],
    TD1: [{ day: "Wed", start: "11:00", end: "11:50" }],
    TE1: [{ day: "Thu", start: "11:00", end: "11:50" }],
    TF1: [{ day: "Fri", start: "11:00", end: "11:50" }],
    TG1: [{ day: "Mon", start: "12:00", end: "12:50" }],
    TAA1: [{ day: "Tue", start: "12:00", end: "12:50" }],
    TCC1: [{ day: "Thu", start: "12:00", end: "12:50" }],

    A2: [{ day: "Mon", start: "14:00", end: "14:50" }, { day: "Wed", start: "15:00", end: "15:50" }],
    B2: [{ day: "Tue", start: "14:00", end: "14:50" }, { day: "Thu", start: "15:00", end: "15:50" }],
    C2: [{ day: "Wed", start: "14:00", end: "14:50" }, { day: "Fri", start: "15:00", end: "15:50" }],
    D2: [{ day: "Thu", start: "14:00", end: "14:50" }, { day: "Mon", start: "16:00", end: "16:50" }],
    E2: [{ day: "Fri", start: "14:00", end: "14:50" }, { day: "Tue", start: "16:00", end: "16:50" }],
    F2: [{ day: "Mon", start: "15:00", end: "15:50" }, { day: "Wed", start: "16:00", end: "16:50" }],
    G2: [{ day: "Tue", start: "15:00", end: "15:50" }, { day: "Thu", start: "16:00", end: "16:50" }],
    TA2: [{ day: "Fri", start: "16:00", end: "16:50" }],
    TB2: [{ day: "Mon", start: "17:00", end: "17:50" }],
    TC2: [{ day: "Tue", start: "17:00", end: "17:50" }],
    TD2: [{ day: "Wed", start: "17:00", end: "17:50" }],
    TE2: [{ day: "Thu", start: "17:00", end: "17:50" }],
    TF2: [{ day: "Fri", start: "17:00", end: "17:50" }],
    TG2: [{ day: "Mon", start: "18:00", end: "18:50" }],
    TAA2: [{ day: "Tue", start: "18:00", end: "18:50" }],
    TCC2: [{ day: "Thu", start: "18:00", end: "18:50" }],
};

["08:00", "09:00", "10:00", "11:00", "12:00"].forEach((start) => {
    DAYS.forEach((day) => {
        const dayOffset = DAYS.indexOf(day) * 5;
        const slotNumber = dayOffset + Number(start.slice(0, 2)) - 7;
        SLOT_MAP[`L${slotNumber}`] = [{ day, start, end: `${start.slice(0, 2)}:50` }];
    });
});
["14:00", "15:00", "16:00", "17:00", "18:00"].forEach((start) => {
    DAYS.forEach((day) => {
        const dayOffset = DAYS.indexOf(day) * 5;
        const slotNumber = 26 + dayOffset + Number(start.slice(0, 2)) - 14;
        SLOT_MAP[`L${slotNumber}`] = [{ day, start, end: `${start.slice(0, 2)}:50` }];
    });
});

const COLORS = [
    "from-indigo-500 to-sky-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-fuchsia-500 to-violet-600",
    "from-lime-500 to-green-600",
    "from-red-500 to-orange-600",
    "from-slate-500 to-gray-600",
    "from-yellow-500 to-amber-600",
    "from-violet-500 to-purple-600",
    "from-teal-500 to-cyan-600",
];

function getCourseColor(index) {
    return COLORS[index % COLORS.length];
}

function getCourseId(course) {
    return [course.code, course.slot, course.faculty, course.title].map((part) => part || "").join("|");
}

function isCourseCodeSelected(course) {
    return selectedCourses.some((selected) => selected.code === course.code);
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[char]));
}

function parseSlots(slotString) {
    return String(slotString || "")
        .split("+")
        .map((slot) => slot.trim().toUpperCase())
        .filter(Boolean);
}

function getUnknownSlots(slotString) {
    return parseSlots(slotString).filter((slot) => !SLOT_MAP[slot]);
}

function getSlotTimings(slotString) {
    return parseSlots(slotString).flatMap((slot) => (
        SLOT_MAP[slot] || []
    ).map((timing) => ({ ...timing, slotName: slot })));
}

function toMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function timesOverlap(a, b) {
    return a.day === b.day && toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}

function formatCourseTime(timing) {
    return `${DAY_LABELS[timing.day] || timing.day}, ${timing.start}-${timing.end}`;
}

function getFilteredCourses() {
    const term = currentFilter.toLowerCase();
    const filtered = allCourses.filter((course) => {
        const searchText = `${course.code} ${course.title || ""} ${course.faculty || ""} ${course.slot || ""} ${course.type || ""}`.toLowerCase();
        const matchesSearch = !term || searchText.includes(term);
        const type = String(course.type || "").toLowerCase();
        const matchesType = currentTypeFilter === "all" || type.includes(currentTypeFilter.toLowerCase());
        return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
        if (currentSort === "faculty") return String(a.faculty || "").localeCompare(String(b.faculty || ""));
        if (currentSort === "credits") return Number(b.credits || 0) - Number(a.credits || 0);
        if (currentSort === "slot") return String(a.slot || "").localeCompare(String(b.slot || ""));
        return String(a.code || "").localeCompare(String(b.code || ""));
    });
}

async function loadCourses() {
    try {
        const response = await fetch("data/data.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        allCourses = Array.isArray(data) ? data : (data.courses || []);
        renderCourseList();
    } catch (error) {
        console.error("Failed to load courses:", error);
        document.getElementById("courseList").innerHTML = `
            <div class="empty-state">
                <i class="fas fa-triangle-exclamation"></i>
                <p>Failed to load courses.</p>
                <span>Run this through a local server so the data file can be fetched.</span>
            </div>`;
    }
}

function filterCourses() {
    currentFilter = document.getElementById("searchInput").value.trim();
    renderCourseList();
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    currentFilter = "";
    renderCourseList();
    document.getElementById("searchInput").focus();
}

function filterByType(type) {
    currentTypeFilter = type;
    document.querySelectorAll(".filter-tag").forEach((button) => {
        const active = button.dataset.filter === type;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });
    renderCourseList();
}

function sortCourses() {
    currentSort = document.getElementById("sortSelect").value;
    renderCourseList();
}

function setDensity(density) {
    timetableDensity = density;
    document.getElementById("timetable").classList.toggle("compact", density === "compact");
    document.querySelectorAll(".density-toggle").forEach((button) => {
        const active = button.dataset.density === density;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

function renderCourseList() {
    const container = document.getElementById("courseList");
    const filtered = getFilteredCourses();
    const selectedIds = new Set(selectedCourses.map(getCourseId));

    document.getElementById("courseCount").textContent = `${filtered.length} courses`;

    if (!filtered.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-magnifying-glass"></i>
                <p>No matching courses found.</p>
                <span>Try a code, faculty name, or slot like A1.</span>
            </div>`;
        return;
    }

    container.innerHTML = filtered.map((course) => {
        const courseId = getCourseId(course);
        const isAdded = selectedIds.has(courseId);
        const sameCodeSelected = !isAdded && isCourseCodeSelected(course);
        const conflict = !isAdded ? checkConflict(course) : null;
        const unknownSlots = getUnknownSlots(course.slot);
        const encodedCourseId = encodeURIComponent(courseId);
        const statusClass = isAdded || sameCodeSelected ? "is-added" : conflict ? "has-conflict" : "";
        const statusText = isAdded
            ? "Added"
            : sameCodeSelected
                ? "Course selected"
            : conflict
                ? `Conflicts with ${escapeHTML(conflict.course.code)}`
                : "Add";

        return `
            <button class="course-card ${statusClass}" onclick="addCourseById('${encodedCourseId}')" ${isAdded || sameCodeSelected ? "disabled" : ""}>
                <span class="course-card-top">
                    <span class="course-code">${escapeHTML(course.code)}</span>
                    <span class="course-slot-label">${escapeHTML(course.slot || "N/A")}</span>
                </span>
                <span class="course-title">${escapeHTML(course.title || "Untitled")}</span>
                <span class="course-meta">
                    <span><i class="fas fa-user-tie"></i>${escapeHTML(course.faculty || "TBA")}</span>
                    <span><i class="fas fa-award"></i>${escapeHTML(course.credits || 0)} cr</span>
                </span>
                ${unknownSlots.length ? `<span class="course-warning"><i class="fas fa-circle-exclamation"></i> Unmapped: ${escapeHTML(unknownSlots.join(", "))}</span>` : ""}
                <span class="course-action">${statusText}</span>
            </button>`;
    }).join("");
}

function addCourseById(encodedCourseId) {
    const courseId = decodeURIComponent(encodedCourseId);
    const course = allCourses.find((item) => getCourseId(item) === courseId);
    if (course) addCourse(course);
}

function checkConflict(course) {
    const newTimings = getSlotTimings(course.slot);
    if (!newTimings.length) return null;

    for (const selected of selectedCourses) {
        const existingTimings = getSlotTimings(selected.slot);
        for (const incoming of newTimings) {
            for (const existing of existingTimings) {
                if (timesOverlap(incoming, existing)) {
                    return {
                        course: selected,
                        day: incoming.day,
                        time: `${incoming.start}-${incoming.end}`,
                        slot: incoming.slotName,
                    };
                }
            }
        }
    }

    return null;
}

function addCourse(course) {
    if (isCourseCodeSelected(course)) {
        showToast(`${course.code} is already selected. Remove it before choosing another section.`, "warning");
        return;
    }

    const conflict = checkConflict(course);
    if (conflict) {
        showToast(`${course.code} ${conflict.slot} clashes with ${conflict.course.code} on ${conflict.day} ${conflict.time}.`, "error", 5200);
        return;
    }

    selectedCourses.push({ ...course, colorIndex: selectedCourses.length });
    syncUI();
    showToast(`${course.code} added to your timetable.`, "success");
}

function removeCourse(index) {
    const removed = selectedCourses.splice(index, 1)[0];
    selectedCourses.forEach((course, courseIndex) => {
        course.colorIndex = courseIndex;
    });
    syncUI();
    showToast(`${removed.code} removed.`, "info");
}

function renderTimetable() {
    const container = document.getElementById("timetable");
    container.classList.toggle("compact", timetableDensity === "compact");

    let html = `<div class="time-slot time-corner">Time</div>`;
    DAYS.forEach((day) => {
        html += `<div class="day-header">${DAY_LABELS[day]}</div>`;
    });

    GRID_ROWS.forEach((row) => {
        if (row.start === "BREAK") {
            html += `<div class="time-slot break-label">${row.label}</div>`;
            DAYS.forEach(() => {
                html += `<div class="cell break-cell"><span>No classes</span></div>`;
            });
            return;
        }

        html += `<div class="time-slot">${row.label.replace(" - ", "<br>")}</div>`;
        DAYS.forEach((day) => {
            html += `<div class="cell" data-cell="${day}-${row.start}"></div>`;
        });
    });

    container.innerHTML = html;

    selectedCourses.forEach((course, courseIndex) => {
        getSlotTimings(course.slot).forEach((timing) => {
            const cell = container.querySelector(`[data-cell="${timing.day}-${timing.start}"]`);
            if (!cell) return;

            const colorClass = getCourseColor(courseIndex);
            cell.innerHTML = `
                <button class="course-slot bg-gradient-to-br ${colorClass}" onclick="focusSelectedCourse(${courseIndex})" title="${escapeHTML(course.title || "")} | ${escapeHTML(course.faculty || "TBA")} | ${escapeHTML(formatCourseTime(timing))}">
                    <span class="slot-code">${escapeHTML(course.code)}</span>
                    <span class="slot-name">${escapeHTML(timing.slotName)}</span>
                    <span class="slot-faculty">${escapeHTML(course.faculty || "TBA")}</span>
                </button>`;
        });
    });
}

function focusSelectedCourse(index) {
    const card = document.querySelector(`[data-selected-index="${index}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    card.classList.add("pulse-once");
    setTimeout(() => card.classList.remove("pulse-once"), 700);
}

function renderSelectedCourses() {
    const container = document.getElementById("selectedCourses");
    if (!selectedCourses.length) {
        container.innerHTML = `
            <div class="empty-state compact-empty">
                <i class="fas fa-calendar-plus"></i>
                <p>No courses added yet.</p>
                <span>Pick from the list above to build your timetable.</span>
            </div>`;
        return;
    }

    container.innerHTML = selectedCourses.map((course, index) => {
        const colorClass = getCourseColor(index);
        const timings = getSlotTimings(course.slot);
        const meetingText = timings.map(formatCourseTime).join(", ") || "No mapped timings";

        return `
            <div class="selected-card" data-selected-index="${index}">
                <div class="selected-accent bg-gradient-to-b ${colorClass}"></div>
                <div class="selected-content">
                    <div class="selected-title-row">
                        <span class="course-code">${escapeHTML(course.code)}</span>
                        <span class="course-slot-label">${escapeHTML(course.slot || "N/A")}</span>
                    </div>
                    <div class="selected-title">${escapeHTML(course.title || "Untitled")}</div>
                    <div class="selected-meta">${escapeHTML(course.faculty || "TBA")} | ${escapeHTML(course.credits || 0)} credits</div>
                    <div class="selected-time">${escapeHTML(meetingText)}</div>
                </div>
                <button class="icon-button danger" onclick="removeCourse(${index})" title="Remove ${escapeHTML(course.code)}">
                    <i class="fas fa-xmark"></i>
                </button>
            </div>`;
    }).join("");
}

function updateStats() {
    const totalCredits = selectedCourses.reduce((sum, course) => sum + (Number(course.credits) || 0), 0);
    const busyCells = selectedCourses.reduce((sum, course) => sum + getSlotTimings(course.slot).length, 0);
    const labCount = selectedCourses.filter((course) => String(course.type || "").toLowerCase().includes("lab")).length;
    const theoryCount = selectedCourses.filter((course) => String(course.type || "").toLowerCase().includes("theory")).length;

    document.getElementById("selectedCount").textContent = selectedCourses.length;
    document.getElementById("totalCredits").textContent = totalCredits;
    document.getElementById("stats").innerHTML = `
        <span><i class="fas fa-book-open"></i>${selectedCourses.length} Courses</span>
        <span><i class="fas fa-award"></i>${totalCredits} Credits</span>
        <span><i class="fas fa-clock"></i>${busyCells} Slots</span>
        <span><i class="fas fa-layer-group"></i>${theoryCount}/${labCount} T/L</span>`;
}

function saveToLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCourses));
}

function loadFromLocal() {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("ffcs_timetable_v2");
    if (!saved) return;

    try {
        selectedCourses = JSON.parse(saved).map((course, index) => ({ ...course, colorIndex: index }));
    } catch (error) {
        selectedCourses = [];
    }
}

function syncUI() {
    saveToLocal();
    renderTimetable();
    renderSelectedCourses();
    renderCourseList();
    updateStats();
}

function clearTimetable() {
    if (!selectedCourses.length) {
        showToast("Your timetable is already empty.", "info");
        return;
    }

    if (!confirm("Clear all selected courses from your timetable?")) return;
    selectedCourses = [];
    syncUI();
    showToast("Timetable cleared.", "info");
}

async function exportTimetable() {
    const timetableEl = document.getElementById("timetable");

    try {
        const canvas = await html2canvas(timetableEl, {
            backgroundColor: "#111827",
            scale: 2,
            useCORS: true,
            logging: false,
        });

        const link = document.createElement("a");
        link.download = `FFCS_Timetable_${new Date().toISOString().split("T")[0]}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        showToast("Timetable exported as PNG.", "success");
    } catch (error) {
        console.error("Export failed:", error);
        showToast("Export failed. Please try again.", "error");
    }
}

function showToast(message, type = "info", duration = 3000) {
    const colors = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        warning: "bg-amber-500",
        info: "bg-indigo-500",
    };
    const icons = {
        success: "check-circle",
        error: "circle-exclamation",
        warning: "triangle-exclamation",
        info: "circle-info",
    };

    document.querySelectorAll(".toast-notification").forEach((toast) => toast.remove());

    const toast = document.createElement("div");
    toast.className = `toast-notification ${colors[type] || colors.info}`;
    toast.innerHTML = `<i class="fas fa-${icons[type] || icons.info}"></i><span>${escapeHTML(message)}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        document.querySelectorAll(".toast-notification").forEach((toast) => toast.remove());
    }

    if (event.ctrlKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        document.getElementById("searchInput").focus();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    loadFromLocal();
    renderTimetable();
    renderSelectedCourses();
    updateStats();
    setDensity(timetableDensity);
    loadCourses();
});
