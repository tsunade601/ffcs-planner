/**
 * Unit tests for transformCourseData – the main data ingestion pipeline.
 */

const { loadScript } = require("./setup");

beforeAll(() => {
  loadScript();
});

describe("transformCourseData", () => {
  it("returns empty array for empty input", () => {
    expect(transformCourseData([])).toEqual([]);
  });

  it("transforms a simple theory course", () => {
    const raw = [{
      course_code: "CSE101",
      course_title: "Intro to CS",
      credits: 4,
      category: "PC",
      slots: [{ slot: "A1+TA1", venue: "AB1-101", faculty: "Dr. X" }],
    }];

    const result = transformCourseData(raw);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      code: "CSE101",
      title: "Intro to CS",
      credits: 4,
      slot: "A1+TA1",
      faculty: "Dr. X",
      venue: "AB1-101",
      type: "Theory",
    });
  });

  it("creates separate entries for each slot option", () => {
    const raw = [{
      course_code: "CSE101",
      course_title: "Intro to CS",
      credits: 4,
      category: "PC",
      slots: [
        { slot: "A1+TA1", venue: "AB1-101", faculty: "Dr. X" },
        { slot: "B1+TB1", venue: "AB1-102", faculty: "Dr. Y" },
      ],
    }];

    const result = transformCourseData(raw);
    expect(result).toHaveLength(2);
    expect(result[0].slot).toBe("A1+TA1");
    expect(result[1].slot).toBe("B1+TB1");
  });

  it("identifies lab slots and transforms code ending in L to P", () => {
    const raw = [{
      course_code: "CSE101L",
      course_title: "Intro to CS",
      credits: 4,
      category: "PC",
      slots: [{ slot: "L1+L2", venue: "LAB-1", faculty: "Dr. Z" }],
    }];

    const result = transformCourseData(raw);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe("CSE101P");
    expect(result[0].type).toBe("Lab");
    expect(result[0].credits).toBe(1);
  });

  it("appends ' Lab' to title when lab slot detected and title lacks 'lab'", () => {
    const raw = [{
      course_code: "CSE101L",
      course_title: "Intro to CS",
      credits: 4,
      category: "PC",
      slots: [{ slot: "L1+L2", venue: "LAB-1", faculty: "Dr. Z" }],
    }];

    const result = transformCourseData(raw);
    expect(result[0].title).toBe("Intro to CS Lab");
  });

  it("does not duplicate 'Lab' in title if already present", () => {
    const raw = [{
      course_code: "CSE101L",
      course_title: "Programming Lab",
      credits: 1,
      category: "PC",
      slots: [{ slot: "L31+L32", venue: "LAB-2", faculty: "Dr. W" }],
    }];

    const result = transformCourseData(raw);
    expect(result[0].title).toBe("Programming Lab");
  });

  it("skips slots with 'theory only' in slot string", () => {
    const raw = [{
      course_code: "CSE201",
      course_title: "Data Structures",
      credits: 3,
      category: "PC",
      slots: [
        { slot: "Theory Only", venue: "", faculty: "" },
        { slot: "A1+TA1", venue: "AB1-101", faculty: "Dr. X" },
      ],
    }];

    const result = transformCourseData(raw);
    expect(result).toHaveLength(1);
    expect(result[0].slot).toBe("A1+TA1");
  });

  it("skips slots with 'lab only' in faculty", () => {
    const raw = [{
      course_code: "CSE201",
      course_title: "Data Structures",
      credits: 3,
      category: "PC",
      slots: [
        { slot: "A1+TA1", venue: "AB1-101", faculty: "Lab Only" },
        { slot: "B1+TB1", venue: "AB1-102", faculty: "Dr. Y" },
      ],
    }];

    const result = transformCourseData(raw);
    expect(result).toHaveLength(1);
    expect(result[0].faculty).toBe("Dr. Y");
  });

  it("skips slots with 'online course' in slot string", () => {
    const raw = [{
      course_code: "CSE301",
      course_title: "Online ML",
      credits: 2,
      category: "OE",
      slots: [
        { slot: "Online Course", venue: "", faculty: "" },
        { slot: "C1+TC1", venue: "AB2-201", faculty: "Prof. A" },
      ],
    }];

    const result = transformCourseData(raw);
    expect(result).toHaveLength(1);
    expect(result[0].slot).toBe("C1+TC1");
  });

  it("skips slots with numeric venue patterns", () => {
    const raw = [{
      course_code: "CSE401",
      course_title: "Networks",
      credits: 3,
      category: "PC",
      slots: [
        { slot: "D1+TD1", venue: "10 20 30 40 3.5", faculty: "Dr. N" },
        { slot: "E1+TE1", venue: "AB1-301", faculty: "Dr. M" },
      ],
    }];

    const result = transformCourseData(raw);
    expect(result).toHaveLength(1);
    expect(result[0].slot).toBe("E1+TE1");
  });

  it("uses fallback field names (code, title) when course_code/course_title missing", () => {
    const raw = [{
      code: "MAT101",
      title: "Calculus",
      credits: 4,
      category: "FC",
      slots: [{ slot: "F1+TF1", venue: "AB1-501", faculty: "Prof. B" }],
    }];

    const result = transformCourseData(raw);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe("MAT101");
    expect(result[0].title).toBe("Calculus");
  });

  it("defaults faculty and venue to TBA when absent", () => {
    const raw = [{
      course_code: "PHY101",
      course_title: "Physics",
      credits: 3,
      category: "FC",
      slots: [{ slot: "G1+TG1" }],
    }];

    const result = transformCourseData(raw);
    expect(result[0].faculty).toBe("TBA");
    expect(result[0].venue).toBe("TBA");
  });

  it("identifies project type from category", () => {
    const raw = [{
      course_code: "PRJ001",
      course_title: "Capstone",
      credits: 6,
      category: "Project",
      slots: [{ slot: "A1+TA1", venue: "LAB-5", faculty: "Dr. P" }],
    }];

    const result = transformCourseData(raw);
    expect(result[0].type).toBe("Project");
  });

  it("identifies project type from title", () => {
    const raw = [{
      course_code: "PRJ002",
      course_title: "Final Year Project",
      credits: 6,
      category: "PC",
      slots: [{ slot: "B1+TB1", venue: "LAB-5", faculty: "Dr. Q" }],
    }];

    const result = transformCourseData(raw);
    expect(result[0].type).toBe("Project");
  });

  it("handles course with no slots array", () => {
    const raw = [{ course_code: "CSE999", course_title: "Empty" }];
    expect(transformCourseData(raw)).toEqual([]);
  });

  it("handles course with empty slots array", () => {
    const raw = [{ course_code: "CSE999", course_title: "Empty", slots: [] }];
    expect(transformCourseData(raw)).toEqual([]);
  });

  it("preserves category in output", () => {
    const raw = [{
      course_code: "CSE101",
      course_title: "Test",
      credits: 3,
      category: "OE",
      slots: [{ slot: "A1+TA1", venue: "AB1-101", faculty: "Dr. X" }],
    }];

    const result = transformCourseData(raw);
    expect(result[0].category).toBe("OE");
  });

  it("does not change code for lab slots when code does not end in L", () => {
    const raw = [{
      course_code: "CSE101",
      course_title: "Test",
      credits: 3,
      category: "PC",
      slots: [{ slot: "L1+L2", venue: "LAB", faculty: "Dr. X" }],
    }];

    const result = transformCourseData(raw);
    expect(result[0].code).toBe("CSE101");
    expect(result[0].type).toBe("Lab");
    expect(result[0].credits).toBe(3);
  });
});
