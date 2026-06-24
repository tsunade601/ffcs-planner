/**
 * Unit tests for localStorage persistence: saveToLocal, loadFromLocal
 */

const { loadScript } = require("./setup");

beforeAll(() => {
  loadScript();
});

beforeEach(() => {
  selectedCourses = [];
  localStorage.clear();
  jest.clearAllMocks();
});

describe("saveToLocal", () => {
  it("saves selectedCourses to localStorage under STORAGE_KEY", () => {
    selectedCourses = [
      { code: "CSE101", slot: "A1+TA1", credits: 4, colorIndex: 0 },
    ];
    saveToLocal();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(selectedCourses)
    );
  });

  it("saves empty array when no courses selected", () => {
    saveToLocal();
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "[]");
  });
});

describe("loadFromLocal", () => {
  it("restores courses from localStorage", () => {
    const courses = [
      { code: "CSE101", slot: "A1+TA1", credits: 4 },
      { code: "MAT201", slot: "B1+TB1", credits: 3 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

    loadFromLocal();
    expect(selectedCourses).toHaveLength(2);
    expect(selectedCourses[0].code).toBe("CSE101");
    expect(selectedCourses[1].code).toBe("MAT201");
  });

  it("assigns colorIndex to each loaded course", () => {
    const courses = [{ code: "CSE101" }, { code: "MAT201" }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

    loadFromLocal();
    expect(selectedCourses[0].colorIndex).toBe(0);
    expect(selectedCourses[1].colorIndex).toBe(1);
  });

  it("falls back to v2 storage key", () => {
    const courses = [{ code: "OLD101", credits: 2 }];
    localStorage.setItem("ffcs_timetable_v2", JSON.stringify(courses));

    loadFromLocal();
    expect(selectedCourses).toHaveLength(1);
    expect(selectedCourses[0].code).toBe("OLD101");
  });

  it("does nothing when localStorage is empty", () => {
    loadFromLocal();
    expect(selectedCourses).toEqual([]);
  });

  it("resets selectedCourses to empty on corrupted data", () => {
    localStorage.setItem(STORAGE_KEY, "{not valid json");
    loadFromLocal();
    expect(selectedCourses).toEqual([]);
  });
});
