// FFCS Planner
let allCourses = [];
let selectedCourses = [];
let currentFilter = "";
let currentTypeFilter = "all";
let currentSort = "code";

const STORAGE_KEY = "ffcs_timetable_v3";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_LABELS = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
};

const THEORY_PERIODS = [
    { label: "08:00 AM\nto\n08:50 AM" },
    { label: "08:55 AM\nto\n09:45 AM" },
    { label: "09:50 AM\nto\n10:40 AM" },
    { label: "10:45 AM\nto\n11:35 AM" },
    { label: "11:40 AM\nto\n12:30 PM" },
];
const AFTERNOON_PERIODS = [
    { label: "02:00 PM\nto\n02:50 PM" },
    { label: "02:55 PM\nto\n03:45 PM" },
    { label: "03:50 PM\nto\n04:40 PM" },
    { label: "04:45 PM\nto\n05:35 PM" },
    { label: "05:40 PM\nto\n06:30 PM" },
];
const LAB_AM_TIMES = ["08:00 AM\nto\n08:50 AM","08:50 AM\nto\n09:40 AM","09:50 AM\nto\n10:40 AM","10:40 AM\nto\n11:30 AM","11:40 AM\nto\n12:30 PM","12:30 PM\nto\n01:20 PM"];
const LAB_PM_TIMES = ["02:00 PM\nto\n02:50 PM","02:50 PM\nto\n03:40 PM","03:50 PM\nto\n04:40 PM","04:40 PM\nto\n05:30 PM","05:40 PM\nto\n06:30 PM","06:30 PM\nto\n07:20 PM"];

const SLOT_MAP = {
    A1: [{ day: "Mon", cell: "l1", start: "08:00", end: "08:50", slotName: "A1" }, { day: "Wed", cell: "l14", start: "08:55", end: "09:45", slotName: "A1" }],
    B1: [{ day: "Tue", cell: "l7", start: "08:00", end: "08:50", slotName: "B1" }, { day: "Thu", cell: "l20", start: "08:55", end: "09:45", slotName: "B1" }],
    C1: [{ day: "Wed", cell: "l13", start: "08:00", end: "08:50", slotName: "C1" }, { day: "Fri", cell: "l26", start: "08:55", end: "09:45", slotName: "C1" }],
    D1: [{ day: "Thu", cell: "l19", start: "08:00", end: "08:50", slotName: "D1" }, { day: "Mon", cell: "l3", start: "09:50", end: "10:40", slotName: "D1" }],
    E1: [{ day: "Fri", cell: "l25", start: "08:00", end: "08:50", slotName: "E1" }, { day: "Tue", cell: "l9", start: "09:50", end: "10:40", slotName: "E1" }],
    F1: [{ day: "Mon", cell: "l2", start: "08:55", end: "09:45", slotName: "F1" }, { day: "Wed", cell: "l15", start: "09:50", end: "10:40", slotName: "F1" }],
    G1: [{ day: "Tue", cell: "l8", start: "08:55", end: "09:45", slotName: "G1" }, { day: "Thu", cell: "l21", start: "09:50", end: "10:40", slotName: "G1" }],
    TA1: [{ day: "Fri", cell: "l27", start: "09:50", end: "10:40", slotName: "TA1" }],
    TB1: [{ day: "Mon", cell: "l4", start: "10:45", end: "11:35", slotName: "TB1" }],
    TC1: [{ day: "Tue", cell: "l10", start: "10:45", end: "11:35", slotName: "TC1" }],
    TD1: [{ day: "Wed", cell: "l16", start: "10:45", end: "11:35", slotName: "TD1" }],
    TE1: [{ day: "Thu", cell: "l22", start: "10:45", end: "11:35", slotName: "TE1" }],
    TF1: [{ day: "Fri", cell: "l28", start: "10:45", end: "11:35", slotName: "TF1" }],
    TG1: [{ day: "Mon", cell: "l5", start: "11:40", end: "12:30", slotName: "TG1" }],
    TAA1: [{ day: "Tue", cell: "l11", start: "11:40", end: "12:30", slotName: "TAA1" }],
    TBB1: [{ day: "Wed", cell: "l17", start: "11:40", end: "12:30", slotName: "TBB1" }],
    TCC1: [{ day: "Thu", cell: "l23", start: "11:40", end: "12:30", slotName: "TCC1" }],
    TDD1: [{ day: "Fri", cell: "l29", start: "11:40", end: "12:30", slotName: "TDD1" }],
    A2: [{ day: "Mon", cell: "l31", start: "14:00", end: "14:50", slotName: "A2" }, { day: "Wed", cell: "l44", start: "14:55", end: "15:45", slotName: "A2" }],
    B2: [{ day: "Tue", cell: "l37", start: "14:00", end: "14:50", slotName: "B2" }, { day: "Thu", cell: "l50", start: "14:55", end: "15:45", slotName: "B2" }],
    C2: [{ day: "Wed", cell: "l43", start: "14:00", end: "14:50", slotName: "C2" }, { day: "Fri", cell: "l56", start: "14:55", end: "15:45", slotName: "C2" }],
    D2: [{ day: "Thu", cell: "l49", start: "14:00", end: "14:50", slotName: "D2" }, { day: "Mon", cell: "l33", start: "15:50", end: "16:40", slotName: "D2" }],
    E2: [{ day: "Fri", cell: "l55", start: "14:00", end: "14:50", slotName: "E2" }, { day: "Tue", cell: "l39", start: "15:50", end: "16:40", slotName: "E2" }],
    F2: [{ day: "Mon", cell: "l32", start: "14:55", end: "15:45", slotName: "F2" }, { day: "Wed", cell: "l45", start: "15:50", end: "16:40", slotName: "F2" }],
    G2: [{ day: "Tue", cell: "l38", start: "14:55", end: "15:45", slotName: "G2" }, { day: "Thu", cell: "l51", start: "15:50", end: "16:40", slotName: "G2" }],
    TA2: [{ day: "Fri", cell: "l57", start: "15:50", end: "16:40", slotName: "TA2" }],
    TB2: [{ day: "Mon", cell: "l34", start: "16:45", end: "17:35", slotName: "TB2" }],
    TC2: [{ day: "Tue", cell: "l40", start: "16:45", end: "17:35", slotName: "TC2" }],
    TD2: [{ day: "Wed", cell: "l46", start: "16:45", end: "17:35", slotName: "TD2" }],
    TE2: [{ day: "Thu", cell: "l52", start: "16:45", end: "17:35", slotName: "TE2" }],
    TF2: [{ day: "Fri", cell: "l58", start: "16:45", end: "17:35", slotName: "TF2" }],
    TG2: [{ day: "Mon", cell: "l35", start: "17:40", end: "18:30", slotName: "TG2" }],
    TAA2: [{ day: "Tue", cell: "l41", start: "17:40", end: "18:30", slotName: "TAA2" }],
    TBB2: [{ day: "Wed", cell: "l47", start: "17:40", end: "18:30", slotName: "TBB2" }],
    TCC2: [{ day: "Thu", cell: "l53", start: "17:40", end: "18:30", slotName: "TCC2" }],
    TDD2: [{ day: "Fri", cell: "l59", start: "17:40", end: "18:30", slotName: "TDD2" }],
    L1: [{ day: "Mon", cell: "l1", start: "08:00", end: "08:50", slotName: "L1" }],
    L2: [{ day: "Mon", cell: "l2", start: "08:50", end: "09:40", slotName: "L2" }],
    L3: [{ day: "Mon", cell: "l3", start: "09:50", end: "10:40", slotName: "L3" }],
    L4: [{ day: "Mon", cell: "l4", start: "10:40", end: "11:30", slotName: "L4" }],
    L5: [{ day: "Mon", cell: "l5", start: "11:40", end: "12:30", slotName: "L5" }],
    L6: [{ day: "Mon", cell: "l6", start: "12:30", end: "13:20", slotName: "L6" }],
    L7: [{ day: "Tue", cell: "l7", start: "08:00", end: "08:50", slotName: "L7" }],
    L8: [{ day: "Tue", cell: "l8", start: "08:50", end: "09:40", slotName: "L8" }],
    L9: [{ day: "Tue", cell: "l9", start: "09:50", end: "10:40", slotName: "L9" }],
    L10: [{ day: "Tue", cell: "l10", start: "10:40", end: "11:30", slotName: "L10" }],
    L11: [{ day: "Tue", cell: "l11", start: "11:40", end: "12:30", slotName: "L11" }],
    L12: [{ day: "Tue", cell: "l12", start: "12:30", end: "13:20", slotName: "L12" }],
    L13: [{ day: "Wed", cell: "l13", start: "08:00", end: "08:50", slotName: "L13" }],
    L14: [{ day: "Wed", cell: "l14", start: "08:50", end: "09:40", slotName: "L14" }],
    L15: [{ day: "Wed", cell: "l15", start: "09:50", end: "10:40", slotName: "L15" }],
    L16: [{ day: "Wed", cell: "l16", start: "10:40", end: "11:30", slotName: "L16" }],
    L17: [{ day: "Wed", cell: "l17", start: "11:40", end: "12:30", slotName: "L17" }],
    L18: [{ day: "Wed", cell: "l18", start: "12:30", end: "13:20", slotName: "L18" }],
    L19: [{ day: "Thu", cell: "l19", start: "08:00", end: "08:50", slotName: "L19" }],
    L20: [{ day: "Thu", cell: "l20", start: "08:50", end: "09:40", slotName: "L20" }],
    L21: [{ day: "Thu", cell: "l21", start: "09:50", end: "10:40", slotName: "L21" }],
    L22: [{ day: "Thu", cell: "l22", start: "10:40", end: "11:30", slotName: "L22" }],
    L23: [{ day: "Thu", cell: "l23", start: "11:40", end: "12:30", slotName: "L23" }],
    L24: [{ day: "Thu", cell: "l24", start: "12:30", end: "13:20", slotName: "L24" }],
    L25: [{ day: "Fri", cell: "l25", start: "08:00", end: "08:50", slotName: "L25" }],
    L26: [{ day: "Fri", cell: "l26", start: "08:50", end: "09:40", slotName: "L26" }],
    L27: [{ day: "Fri", cell: "l27", start: "09:50", end: "10:40", slotName: "L27" }],
    L28: [{ day: "Fri", cell: "l28", start: "10:40", end: "11:30", slotName: "L28" }],
    L29: [{ day: "Fri", cell: "l29", start: "11:40", end: "12:30", slotName: "L29" }],
    L30: [{ day: "Fri", cell: "l30", start: "12:30", end: "13:20", slotName: "L30" }],
    L31: [{ day: "Mon", cell: "l31", start: "14:00", end: "14:50", slotName: "L31" }],
    L32: [{ day: "Mon", cell: "l32", start: "14:50", end: "15:40", slotName: "L32" }],
    L33: [{ day: "Mon", cell: "l33", start: "15:50", end: "16:40", slotName: "L33" }],
    L34: [{ day: "Mon", cell: "l34", start: "16:40", end: "17:30", slotName: "L34" }],
    L35: [{ day: "Mon", cell: "l35", start: "17:40", end: "18:30", slotName: "L35" }],
    L36: [{ day: "Mon", cell: "l36", start: "18:30", end: "19:20", slotName: "L36" }],
    L37: [{ day: "Tue", cell: "l37", start: "14:00", end: "14:50", slotName: "L37" }],
    L38: [{ day: "Tue", cell: "l38", start: "14:50", end: "15:40", slotName: "L38" }],
    L39: [{ day: "Tue", cell: "l39", start: "15:50", end: "16:40", slotName: "L39" }],
    L40: [{ day: "Tue", cell: "l40", start: "16:40", end: "17:30", slotName: "L40" }],
    L41: [{ day: "Tue", cell: "l41", start: "17:40", end: "18:30", slotName: "L41" }],
    L42: [{ day: "Tue", cell: "l42", start: "18:30", end: "19:20", slotName: "L42" }],
    L43: [{ day: "Wed", cell: "l43", start: "14:00", end: "14:50", slotName: "L43" }],
    L44: [{ day: "Wed", cell: "l44", start: "14:50", end: "15:40", slotName: "L44" }],
    L45: [{ day: "Wed", cell: "l45", start: "15:50", end: "16:40", slotName: "L45" }],
    L46: [{ day: "Wed", cell: "l46", start: "16:40", end: "17:30", slotName: "L46" }],
    L47: [{ day: "Wed", cell: "l47", start: "17:40", end: "18:30", slotName: "L47" }],
    L48: [{ day: "Wed", cell: "l48", start: "18:30", end: "19:20", slotName: "L48" }],
    L49: [{ day: "Thu", cell: "l49", start: "14:00", end: "14:50", slotName: "L49" }],
    L50: [{ day: "Thu", cell: "l50", start: "14:50", end: "15:40", slotName: "L50" }],
    L51: [{ day: "Thu", cell: "l51", start: "15:50", end: "16:40", slotName: "L51" }],
    L52: [{ day: "Thu", cell: "l52", start: "16:40", end: "17:30", slotName: "L52" }],
    L53: [{ day: "Thu", cell: "l53", start: "17:40", end: "18:30", slotName: "L53" }],
    L54: [{ day: "Thu", cell: "l54", start: "18:30", end: "19:20", slotName: "L54" }],
    L55: [{ day: "Fri", cell: "l55", start: "14:00", end: "14:50", slotName: "L55" }],
    L56: [{ day: "Fri", cell: "l56", start: "14:50", end: "15:40", slotName: "L56" }],
    L57: [{ day: "Fri", cell: "l57", start: "15:50", end: "16:40", slotName: "L57" }],
    L58: [{ day: "Fri", cell: "l58", start: "16:40", end: "17:30", slotName: "L58" }],
    L59: [{ day: "Fri", cell: "l59", start: "17:40", end: "18:30", slotName: "L59" }],
    L60: [{ day: "Fri", cell: "l60", start: "18:30", end: "19:20", slotName: "L60" }],
};

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

/**
 * Transform raw course data from data.json into flat course entries.
 * Each slot option becomes a separate selectable course entry.
 */
function transformCourseData(rawCourses) {
    const transformed = [];
    
    for (const raw of rawCourses) {
        const courseCode = raw.course_code || raw.code || "";
        const courseTitle = raw.course_title || raw.title || "Untitled";
        const credits = raw.credits || 0;
        const category = raw.category || "";
        const slots = raw.slots || [];
        
        // Determine course type based on category or title
        let courseType = "Theory";
        const titleLower = courseTitle.toLowerCase();
        const catLower = category.toLowerCase();
        if (catLower.includes("lab") || titleLower.includes("lab")) {
            courseType = "Lab";
        } else if (catLower.includes("project") || titleLower.includes("project")) {
            courseType = "Project";
        }
        
        // If no slots defined, create a placeholder
        if (slots.length === 0) {
            transformed.push({
                code: courseCode,
                title: courseTitle,
                credits: credits,
                category: category,
                slot: "",
                faculty: "TBA",
                venue: "TBA",
                type: courseType,
            });
            continue;
        }
        
        // Create one entry per slot option
        for (const slotOption of slots) {
            const slotStr = slotOption.slot || "";
            const faculty = slotOption.faculty || "TBA";
            const venue = slotOption.venue || "TBA";
            
            transformed.push({
                code: courseCode,
                title: courseTitle,
                credits: credits,
                category: category,
                slot: slotStr,
                faculty: faculty,
                venue: venue,
                type: courseType,
            });
        }
    }
    
    return transformed;
}

function getCourseId(course) {
    return [course.code, course.slot, course.faculty, course.title].map((part) => part || "").join("|");
}

/**
 * Check if any section of a course (by code) is already selected.
 */
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
    return a.cell === b.cell;
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
        const rawData = await response.json();
        // Transform the raw data from data.json format to flat course entries
        allCourses = Array.isArray(rawData) ? transformCourseData(rawData) : transformCourseData(rawData.courses || []);
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
    const daySlots = {
        Mon: ["l1","l2","l3","l4","l5","l6","l31","l32","l33","l34","l35","l36"],
        Tue: ["l7","l8","l9","l10","l11","l12","l37","l38","l39","l40","l41","l42"],
        Wed: ["l13","l14","l15","l16","l17","l18","l43","l44","l45","l46","l47","l48"],
        Thu: ["l19","l20","l21","l22","l23","l24","l49","l50","l51","l52","l53","l54"],
        Fri: ["l25","l26","l27","l28","l29","l30","l55","l56","l57","l58","l59","l60"],
    };
    const theoryLabels = ["A1","F1","D1","TB1","TG1","A2","F2","D2","TB2","TG2"];
    const labLabels = ["L1","L2","L3","L4","L5","L6","L31","L32","L33","L34","L35","L36"];
    const slotLabels = {
        Mon: ["A1/L1","F1/L2","D1/L3","TB1/L4","TG1/L5","L6","A2/L31","F2/L32","D2/L33","TB2/L34","TG2/L35","L36"],
        Tue: ["B1/L7","G1/L8","E1/L9","TC1/L10","TAA1/L11","L12","B2/L37","G2/L38","E2/L39","TC2/L40","TAA2/L41","L42"],
        Wed: ["C1/L13","A1/L14","F1/L15","TD1/L16","TBB1/L17","L18","C2/L43","A2/L44","F2/L45","TD2/L46","TBB2/L47","L48"],
        Thu: ["D1/L19","B1/L20","G1/L21","TE1/L22","TCC1/L23","L24","D2/L49","B2/L50","G2/L51","TE2/L52","TCC2/L53","L54"],
        Fri: ["E1/L25","C1/L26","TA1/L27","TF1/L28","TDD1/L29","L30","E2/L55","C2/L56","TA2/L57","TF2/L58","TDD2/L59","L60"],
    };

    let html = '<table class="tt-table" cellspacing="0" cellpadding="2">';
    // Theory hours header
    html += '<tr class="tt-header-row">';
    html += '<td class="tt-corner"><b>THEORY<br>HOURS</b></td>';
    THEORY_PERIODS.forEach(p => {
        html += `<td class="tt-theory-header">${p.label.replace(/\n/g, '<br>')}</td>`;
    });
    html += '<td class="tt-empty-header"></td>';
    html += '<td class="tt-lunch" rowspan="7"><b>L<br>U<br>N<br>C<br>H</b></td>';
    AFTERNOON_PERIODS.forEach(p => {
        html += `<td class="tt-theory-header">${p.label.replace(/\n/g, '<br>')}</td>`;
    });
    html += '<td class="tt-empty-header"></td>';
    html += '</tr>';

    // Lab hours header
    html += '<tr class="tt-header-row">';
    html += '<td class="tt-corner"><b>LAB<br>HOURS</b></td>';
    LAB_AM_TIMES.forEach(t => {
        html += `<td class="tt-lab-header">${t.replace(/\n/g, '<br>')}</td>`;
    });
    LAB_PM_TIMES.forEach(t => {
        html += `<td class="tt-lab-header">${t.replace(/\n/g, '<br>')}</td>`;
    });
    html += '</tr>';

    // Day rows
    DAYS.forEach(day => {
        html += `<tr class="tt-day-row">`;
        html += `<td class="tt-day-label"><b>${day.toUpperCase()}</b></td>`;
        daySlots[day].forEach((cellId, i) => {
            const label = slotLabels[day][i];
            html += `<td class="tt-slot" id="${cellId}" data-cell="${cellId}"><span class="tt-slot-label">${label}</span></td>`;
        });
        html += '</tr>';
    });

    html += '</table>';
    container.innerHTML = html;

    // Fill in selected courses
    selectedCourses.forEach((course, courseIndex) => {
        getSlotTimings(course.slot).forEach((timing) => {
            const cell = container.querySelector(`[data-cell="${timing.cell}"]`);
            if (!cell) return;

            const colorClass = getCourseColor(courseIndex);
            cell.innerHTML = `
                <button class="course-slot bg-gradient-to-br ${colorClass}" onclick="focusSelectedCourse(${courseIndex})" title="${escapeHTML(course.title || "")} | ${escapeHTML(course.faculty || "TBA")} | ${escapeHTML(timing.slotName)}">
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
    loadCourses();
});
