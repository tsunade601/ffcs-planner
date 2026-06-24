/**
 * Unit tests for conflict detection, course management, and selection state:
 *   checkConflict, addCourse, removeCourse, isCourseCodeSelected
 */

const { loadScript } = require("./setup");

beforeAll(() => {
  loadScript();
});

beforeEach(() => {
  selectedCourses = [];
  allCourses = [];
});

// --------------- isCourseCodeSelected ---------------

describe("isCourseCodeSelected", () => {
  it("returns false when no courses are selected", () => {
    expect(isCourseCodeSelected({ code: "CSE101" })).toBe(false);
  });

  it("returns true when a course with the same code is selected", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1+TA1" }];
    expect(isCourseCodeSelected({ code: "CSE101" })).toBe(true);
  });

  it("returns false when a different code is selected", () => {
    selectedCourses = [{ code: "MAT201", slot: "B1+TB1" }];
    expect(isCourseCodeSelected({ code: "CSE101" })).toBe(false);
  });

  it("matches on code regardless of different slot/faculty", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1+TA1", faculty: "Dr. X" }];
    expect(isCourseCodeSelected({ code: "CSE101", slot: "B1+TB1", faculty: "Dr. Y" })).toBe(true);
  });
});

// --------------- checkConflict ---------------

describe("checkConflict", () => {
  it("returns null when no courses are selected", () => {
    expect(checkConflict({ slot: "A1+TA1" })).toBeNull();
  });

  it("returns null when there is no conflict", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1+TA1" }];
    expect(checkConflict({ slot: "B1+TB1" })).toBeNull();
  });

  it("detects conflict when slots share a cell", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1+TA1" }];
    // L1 shares cell l1 with A1 on Monday
    const conflict = checkConflict({ slot: "L1" });
    expect(conflict).not.toBeNull();
    expect(conflict.course.code).toBe("CSE101");
  });

  it("detects conflict between two theory slots using same cell", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1" }];
    // A1 second meeting is Wed cell l14, same as A1's second meeting
    // Let's use a slot that explicitly shares a cell with A1
    // A1 = Mon l1, Wed l14; L14 = Wed l14
    const conflict = checkConflict({ slot: "L14" });
    expect(conflict).not.toBeNull();
    expect(conflict.course.code).toBe("CSE101");
  });

  it("returns null when course has unknown/unmapped slots", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1+TA1" }];
    expect(checkConflict({ slot: "FAKE1" })).toBeNull();
  });

  it("returns null for empty slot string", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1+TA1" }];
    expect(checkConflict({ slot: "" })).toBeNull();
  });

  it("returns conflict details with day and time", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1" }];
    const conflict = checkConflict({ slot: "L1" }); // shares cell l1 with A1
    expect(conflict).toMatchObject({
      day: "Mon",
      slot: "L1",
    });
    expect(conflict.time).toBeDefined();
  });

  it("detects conflict between afternoon slots sharing cells", () => {
    selectedCourses = [{ code: "CSE101", slot: "A2" }];
    // A2 = Mon l31, Wed l44; L31 shares cell with A2 on Monday
    const conflict = checkConflict({ slot: "L31" });
    expect(conflict).not.toBeNull();
  });

  it("does not conflict when different days, different cells", () => {
    selectedCourses = [{ code: "CSE101", slot: "A1" }]; // Mon l1, Wed l14
    // B1 = Tue l7, Thu l20 – no shared cells
    expect(checkConflict({ slot: "B1" })).toBeNull();
  });
});

// --------------- addCourse ---------------

describe("addCourse", () => {
  let toastSpy;

  beforeEach(() => {
    selectedCourses = [];
    // showToast manipulates DOM, spy on it
    toastSpy = jest.spyOn(global, "showToast").mockImplementation(() => {});
  });

  afterEach(() => {
    toastSpy.mockRestore();
  });

  it("adds a course to selectedCourses", () => {
    // Need syncUI to not throw – mock it
    const syncSpy = jest.spyOn(global, "syncUI").mockImplementation(() => {});
    const course = { code: "CSE101", slot: "A1+TA1", faculty: "Dr. X", title: "Intro" };
    addCourse(course);
    expect(selectedCourses).toHaveLength(1);
    expect(selectedCourses[0].code).toBe("CSE101");
    syncSpy.mockRestore();
  });

  it("assigns colorIndex to the added course", () => {
    const syncSpy = jest.spyOn(global, "syncUI").mockImplementation(() => {});
    addCourse({ code: "CSE101", slot: "A1+TA1" });
    expect(selectedCourses[0].colorIndex).toBe(0);
    addCourse({ code: "MAT201", slot: "B1+TB1" });
    expect(selectedCourses[1].colorIndex).toBe(1);
    syncSpy.mockRestore();
  });

  it("shows success toast on add", () => {
    const syncSpy = jest.spyOn(global, "syncUI").mockImplementation(() => {});
    addCourse({ code: "CSE101", slot: "A1+TA1" });
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining("CSE101"), "success");
    syncSpy.mockRestore();
  });

  it("prevents adding duplicate course code", () => {
    const syncSpy = jest.spyOn(global, "syncUI").mockImplementation(() => {});
    addCourse({ code: "CSE101", slot: "A1+TA1" });
    addCourse({ code: "CSE101", slot: "B1+TB1" });
    expect(selectedCourses).toHaveLength(1);
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining("already selected"), "warning");
    syncSpy.mockRestore();
  });

  it("prevents adding conflicting course", () => {
    const syncSpy = jest.spyOn(global, "syncUI").mockImplementation(() => {});
    addCourse({ code: "CSE101", slot: "A1+TA1" });
    addCourse({ code: "MAT201", slot: "L1" }); // L1 conflicts with A1 (cell l1)
    expect(selectedCourses).toHaveLength(1);
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining("clashes"), "error", expect.any(Number));
    syncSpy.mockRestore();
  });
});

// --------------- removeCourse ---------------

describe("removeCourse", () => {
  let toastSpy;
  let syncSpy;

  beforeEach(() => {
    toastSpy = jest.spyOn(global, "showToast").mockImplementation(() => {});
    syncSpy = jest.spyOn(global, "syncUI").mockImplementation(() => {});
    selectedCourses = [
      { code: "CSE101", slot: "A1+TA1", colorIndex: 0 },
      { code: "MAT201", slot: "B1+TB1", colorIndex: 1 },
      { code: "PHY101", slot: "C1+TC1", colorIndex: 2 },
    ];
  });

  afterEach(() => {
    toastSpy.mockRestore();
    syncSpy.mockRestore();
  });

  it("removes the course at the given index", () => {
    removeCourse(1);
    expect(selectedCourses).toHaveLength(2);
    expect(selectedCourses.every((c) => c.code !== "MAT201")).toBe(true);
  });

  it("reassigns colorIndex after removal", () => {
    removeCourse(0);
    expect(selectedCourses[0].colorIndex).toBe(0);
    expect(selectedCourses[1].colorIndex).toBe(1);
  });

  it("shows info toast with removed course code", () => {
    removeCourse(0);
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining("CSE101"), "info");
  });

  it("calls syncUI after removal", () => {
    removeCourse(0);
    expect(syncSpy).toHaveBeenCalled();
  });
});
