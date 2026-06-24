/**
 * Unit tests for getFilteredCourses – search, type-filter, and sort logic.
 */

const { loadScript } = require("./setup");

beforeAll(() => {
  loadScript();
});

const sampleCourses = [
  { code: "CSE101", title: "Intro to CS", faculty: "Dr. X", credits: 4, slot: "A1+TA1", type: "Theory" },
  { code: "MAT201", title: "Linear Algebra", faculty: "Prof. Y", credits: 3, slot: "B1+TB1", type: "Theory" },
  { code: "CSE101P", title: "CS Lab", faculty: "Dr. Z", credits: 1, slot: "L1+L2", type: "Lab" },
  { code: "PHY101", title: "Physics I", faculty: "Dr. A", credits: 4, slot: "C1+TC1", type: "Theory" },
];

beforeEach(() => {
  allCourses = [...sampleCourses];
  currentFilter = "";
  currentTypeFilter = "all";
  currentSort = "code";
});

describe("getFilteredCourses", () => {
  describe("search filter", () => {
    it("returns all courses when filter is empty", () => {
      expect(getFilteredCourses()).toHaveLength(4);
    });

    it("filters by course code", () => {
      currentFilter = "cse101";
      const result = getFilteredCourses();
      expect(result.every((c) => c.code.toLowerCase().includes("cse101"))).toBe(true);
    });

    it("filters by faculty name", () => {
      currentFilter = "dr. x";
      const result = getFilteredCourses();
      expect(result).toHaveLength(1);
      expect(result[0].faculty).toBe("Dr. X");
    });

    it("filters by title keyword", () => {
      currentFilter = "algebra";
      const result = getFilteredCourses();
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("MAT201");
    });

    it("filters by slot name", () => {
      currentFilter = "a1";
      const result = getFilteredCourses();
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some((c) => c.slot.includes("A1"))).toBe(true);
    });

    it("returns empty when no match", () => {
      currentFilter = "zzzzz";
      expect(getFilteredCourses()).toHaveLength(0);
    });

    it("is case-insensitive", () => {
      currentFilter = "PHYSICS";
      const result = getFilteredCourses();
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("PHY101");
    });
  });

  describe("type filter", () => {
    it("returns only labs when type is lab", () => {
      currentTypeFilter = "lab";
      const result = getFilteredCourses();
      expect(result.every((c) => c.type.toLowerCase().includes("lab"))).toBe(true);
    });

    it("returns only theory when type is theory", () => {
      currentTypeFilter = "theory";
      const result = getFilteredCourses();
      expect(result.every((c) => c.type.toLowerCase().includes("theory"))).toBe(true);
    });

    it("returns all when type is all", () => {
      currentTypeFilter = "all";
      expect(getFilteredCourses()).toHaveLength(4);
    });
  });

  describe("combined search and type filter", () => {
    it("applies both filters together", () => {
      currentFilter = "cse";
      currentTypeFilter = "lab";
      const result = getFilteredCourses();
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("CSE101P");
    });
  });

  describe("sorting", () => {
    it("sorts by code (default)", () => {
      currentSort = "code";
      const result = getFilteredCourses();
      expect(result[0].code).toBe("CSE101");
      expect(result[1].code).toBe("CSE101P");
      expect(result[2].code).toBe("MAT201");
      expect(result[3].code).toBe("PHY101");
    });

    it("sorts by faculty", () => {
      currentSort = "faculty";
      const result = getFilteredCourses();
      expect(result[0].faculty).toBe("Dr. A");
      expect(result[1].faculty).toBe("Dr. X");
    });

    it("sorts by credits descending", () => {
      currentSort = "credits";
      const result = getFilteredCourses();
      expect(result[0].credits).toBe(4);
      expect(result[result.length - 1].credits).toBe(1);
    });

    it("sorts by slot", () => {
      currentSort = "slot";
      const result = getFilteredCourses();
      expect(result[0].slot).toBe("A1+TA1");
    });
  });
});
