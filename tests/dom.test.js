/**
 * Unit tests for DOM-interacting functions:
 *   showToast, updateStats, clearTimetable, renderSelectedCourses,
 *   renderTimetable, filterByType, sortCourses
 */

const { loadScript } = require("./setup");

beforeAll(() => {
  loadScript();
});

beforeEach(() => {
  selectedCourses = [];
  allCourses = [];
  currentFilter = "";
  currentTypeFilter = "all";
  currentSort = "code";
  document.querySelectorAll(".toast-notification").forEach((t) => t.remove());
});

// --------------- showToast ---------------

describe("showToast", () => {
  it("creates a toast element in the DOM", () => {
    showToast("Hello", "info");
    const toast = document.querySelector(".toast-notification");
    expect(toast).not.toBeNull();
    expect(toast.textContent).toContain("Hello");
  });

  it("applies correct colour class for each type", () => {
    showToast("ok", "success");
    expect(document.querySelector(".toast-notification").classList.contains("bg-emerald-500")).toBe(true);

    document.querySelectorAll(".toast-notification").forEach((t) => t.remove());
    showToast("err", "error");
    expect(document.querySelector(".toast-notification").classList.contains("bg-red-500")).toBe(true);

    document.querySelectorAll(".toast-notification").forEach((t) => t.remove());
    showToast("warn", "warning");
    expect(document.querySelector(".toast-notification").classList.contains("bg-amber-500")).toBe(true);
  });

  it("removes previous toasts before adding a new one", () => {
    showToast("first", "info");
    showToast("second", "info");
    const toasts = document.querySelectorAll(".toast-notification");
    expect(toasts).toHaveLength(1);
    expect(toasts[0].textContent).toContain("second");
  });

  it("escapes HTML in the message", () => {
    showToast("<script>alert(1)</script>", "info");
    const toast = document.querySelector(".toast-notification");
    expect(toast.innerHTML).not.toContain("<script>");
    expect(toast.textContent).toContain("<script>");
  });
});

// --------------- updateStats ---------------

describe("updateStats", () => {
  it("renders zero stats when no courses are selected", () => {
    updateStats();
    expect(document.getElementById("selectedCount").textContent).toBe("0");
    expect(document.getElementById("totalCredits").textContent).toBe("0");
  });

  it("sums credits correctly", () => {
    selectedCourses = [
      { code: "CSE101", credits: 4, slot: "A1+TA1", type: "Theory" },
      { code: "MAT201", credits: 3, slot: "B1+TB1", type: "Theory" },
    ];
    updateStats();
    expect(document.getElementById("totalCredits").textContent).toBe("7");
    expect(document.getElementById("selectedCount").textContent).toBe("2");
  });

  it("counts theory and lab courses", () => {
    selectedCourses = [
      { code: "CSE101", credits: 4, slot: "A1+TA1", type: "Theory" },
      { code: "CSE101P", credits: 1, slot: "L1+L2", type: "Lab" },
    ];
    updateStats();
    const statsHTML = document.getElementById("stats").innerHTML;
    expect(statsHTML).toContain("1/1 T/L");
  });

  it("counts slot timings", () => {
    selectedCourses = [
      { code: "CSE101", credits: 4, slot: "A1+TA1", type: "Theory" },
    ];
    updateStats();
    const statsHTML = document.getElementById("stats").innerHTML;
    // A1 = 2 slots, TA1 = 1 slot = 3 total
    expect(statsHTML).toContain("3 Slots");
  });
});

// --------------- clearTimetable ---------------

describe("clearTimetable", () => {
  let toastSpy;

  beforeEach(() => {
    toastSpy = jest.spyOn(global, "showToast").mockImplementation(() => {});
  });

  afterEach(() => {
    toastSpy.mockRestore();
  });

  it("shows info toast when timetable is already empty", () => {
    selectedCourses = [];
    clearTimetable();
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining("already empty"), "info");
  });

  it("clears selected courses after confirmation", () => {
    const syncSpy = jest.spyOn(global, "syncUI").mockImplementation(() => {});
    selectedCourses = [{ code: "CSE101", slot: "A1+TA1" }];
    global.confirm = jest.fn(() => true);
    clearTimetable();
    expect(selectedCourses).toHaveLength(0);
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining("cleared"), "info");
    syncSpy.mockRestore();
  });

  it("does not clear when user cancels confirmation", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1+TA1" }];
    global.confirm = jest.fn(() => false);
    clearTimetable();
    expect(selectedCourses).toHaveLength(1);
  });
});

// --------------- renderSelectedCourses ---------------

describe("renderSelectedCourses", () => {
  it("shows empty state when no courses selected", () => {
    renderSelectedCourses();
    const container = document.getElementById("selectedCourses");
    expect(container.innerHTML).toContain("No courses added yet");
  });

  it("renders selected course cards", () => {
    selectedCourses = [
      { code: "CSE101", title: "Intro", slot: "A1+TA1", faculty: "Dr. X", credits: 4, type: "Theory", colorIndex: 0 },
    ];
    renderSelectedCourses();
    const container = document.getElementById("selectedCourses");
    expect(container.innerHTML).toContain("CSE101");
    expect(container.innerHTML).toContain("Intro");
    expect(container.innerHTML).toContain("Dr. X");
  });

  it("renders meeting times for selected courses", () => {
    selectedCourses = [
      { code: "CSE101", title: "Intro", slot: "A1+TA1", faculty: "Dr. X", credits: 4, type: "Theory", colorIndex: 0 },
    ];
    renderSelectedCourses();
    const container = document.getElementById("selectedCourses");
    expect(container.innerHTML).toContain("Monday");
  });
});

// --------------- renderTimetable ---------------

describe("renderTimetable", () => {
  it("renders the timetable table structure", () => {
    renderTimetable();
    const container = document.getElementById("timetable");
    expect(container.querySelector("table")).not.toBeNull();
    expect(container.innerHTML).toContain("MON");
    expect(container.innerHTML).toContain("TUE");
    expect(container.innerHTML).toContain("WED");
    expect(container.innerHTML).toContain("THU");
    expect(container.innerHTML).toContain("FRI");
  });

  it("renders slot labels in cells", () => {
    renderTimetable();
    const container = document.getElementById("timetable");
    expect(container.innerHTML).toContain("A1/L1");
    expect(container.innerHTML).toContain("B1/L7");
  });

  it("fills cells for selected courses", () => {
    selectedCourses = [
      { code: "CSE101", title: "Intro", slot: "A1", faculty: "Dr. X", colorIndex: 0 },
    ];
    renderTimetable();
    const container = document.getElementById("timetable");
    expect(container.innerHTML).toContain("CSE101");
    expect(container.innerHTML).toContain("course-slot");
  });

  it("renders lunch column", () => {
    renderTimetable();
    const container = document.getElementById("timetable");
    // Lunch is rendered as vertical letters: L<br>U<br>N<br>C<br>H
    expect(container.querySelector(".tt-lunch")).not.toBeNull();
    expect(container.querySelector(".tt-lunch").textContent).toContain("L");
  });
});

// --------------- filterByType ---------------

describe("filterByType", () => {
  beforeEach(() => {
    // Add filter tag buttons to DOM
    document.body.innerHTML += `
      <button class="filter-tag" data-filter="all">All</button>
      <button class="filter-tag" data-filter="theory">Theory</button>
      <button class="filter-tag" data-filter="lab">Lab</button>
    `;
  });

  it("sets currentTypeFilter", () => {
    filterByType("lab");
    expect(currentTypeFilter).toBe("lab");
  });

  it("marks the correct button as active", () => {
    filterByType("theory");
    const theoryBtn = document.querySelector('[data-filter="theory"]');
    expect(theoryBtn.classList.contains("active")).toBe(true);
    expect(theoryBtn.getAttribute("aria-pressed")).toBe("true");
  });
});

// --------------- sortCourses ---------------

describe("sortCourses", () => {
  it("updates currentSort from select element", () => {
    const select = document.getElementById("sortSelect");
    select.innerHTML = '<option value="faculty">Faculty</option>';
    select.value = "faculty";
    sortCourses();
    expect(currentSort).toBe("faculty");
  });
});
