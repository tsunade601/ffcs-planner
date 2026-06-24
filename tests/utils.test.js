/**
 * Unit tests for pure utility functions in script.js:
 *   getCourseColor, escapeHTML, parseSlots, getUnknownSlots,
 *   getSlotTimings, toMinutes, timesOverlap, formatCourseTime,
 *   getCourseId
 */

const { loadScript } = require("./setup");

beforeAll(() => {
  loadScript();
});

// --------------- getCourseColor ---------------

describe("getCourseColor", () => {
  it("returns the first colour for index 0", () => {
    expect(getCourseColor(0)).toBe(COLORS[0]);
  });

  it("wraps around when index exceeds colour array length", () => {
    expect(getCourseColor(COLORS.length)).toBe(COLORS[0]);
    expect(getCourseColor(COLORS.length + 1)).toBe(COLORS[1]);
  });

  it("returns correct colour for mid-range index", () => {
    expect(getCourseColor(5)).toBe(COLORS[5]);
  });
});

// --------------- escapeHTML ---------------

describe("escapeHTML", () => {
  it("escapes ampersand", () => {
    expect(escapeHTML("A&B")).toBe("A&amp;B");
  });

  it("escapes angle brackets", () => {
    expect(escapeHTML("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes double quotes", () => {
    expect(escapeHTML('"hello"')).toBe("&quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHTML("it's")).toBe("it&#039;s");
  });

  it("returns empty string for undefined input (uses default parameter)", () => {
    expect(escapeHTML(undefined)).toBe("");
  });

  it("returns empty string for empty string input", () => {
    expect(escapeHTML("")).toBe("");
  });

  it("handles strings with no special characters", () => {
    expect(escapeHTML("hello world")).toBe("hello world");
  });

  it("escapes multiple special characters in one string", () => {
    expect(escapeHTML('<a href="x">&')).toBe("&lt;a href=&quot;x&quot;&gt;&amp;");
  });
});

// --------------- parseSlots ---------------

describe("parseSlots", () => {
  it("splits a composite slot string", () => {
    expect(parseSlots("A1+TA1")).toEqual(["A1", "TA1"]);
  });

  it("uppercases slot names", () => {
    expect(parseSlots("a1+ta1")).toEqual(["A1", "TA1"]);
  });

  it("trims whitespace around slot names", () => {
    expect(parseSlots(" A1 + TA1 ")).toEqual(["A1", "TA1"]);
  });

  it("returns empty array for empty string", () => {
    expect(parseSlots("")).toEqual([]);
  });

  it("returns empty array for null/undefined", () => {
    expect(parseSlots(null)).toEqual([]);
    expect(parseSlots(undefined)).toEqual([]);
  });

  it("handles a single slot", () => {
    expect(parseSlots("B1")).toEqual(["B1"]);
  });

  it("handles lab slots", () => {
    expect(parseSlots("L1+L2")).toEqual(["L1", "L2"]);
  });
});

// --------------- getUnknownSlots ---------------

describe("getUnknownSlots", () => {
  it("returns empty array when all slots are known", () => {
    expect(getUnknownSlots("A1+TA1")).toEqual([]);
  });

  it("returns unknown slot names", () => {
    expect(getUnknownSlots("A1+FAKE1")).toEqual(["FAKE1"]);
  });

  it("excludes NIL from unknown list", () => {
    expect(getUnknownSlots("NIL")).toEqual([]);
  });

  it("returns empty for empty string", () => {
    expect(getUnknownSlots("")).toEqual([]);
  });

  it("identifies multiple unknown slots", () => {
    expect(getUnknownSlots("X1+Y2")).toEqual(["X1", "Y2"]);
  });
});

// --------------- getSlotTimings ---------------

describe("getSlotTimings", () => {
  it("returns timing entries for a known theory slot", () => {
    const timings = getSlotTimings("A1");
    expect(timings.length).toBe(2);
    expect(timings[0]).toMatchObject({ day: "Mon", slotName: "A1" });
    expect(timings[1]).toMatchObject({ day: "Wed", slotName: "A1" });
  });

  it("returns timing entries for composite slots", () => {
    const timings = getSlotTimings("A1+TA1");
    expect(timings.length).toBe(3); // A1 = 2 meetings, TA1 = 1
  });

  it("returns empty array for unknown slot", () => {
    expect(getSlotTimings("FAKE")).toEqual([]);
  });

  it("returns empty for empty string", () => {
    expect(getSlotTimings("")).toEqual([]);
  });

  it("returns timings for lab slots", () => {
    const timings = getSlotTimings("L1+L2");
    expect(timings.length).toBe(2);
    expect(timings[0]).toMatchObject({ day: "Mon", slotName: "L1" });
    expect(timings[1]).toMatchObject({ day: "Mon", slotName: "L2" });
  });

  it("returns timings for afternoon slots", () => {
    const timings = getSlotTimings("A2");
    expect(timings.length).toBe(2);
    expect(timings[0]).toMatchObject({ day: "Mon", slotName: "A2" });
    expect(timings[1]).toMatchObject({ day: "Wed", slotName: "A2" });
  });

  it("handles tutorial slots (single meeting)", () => {
    const timings = getSlotTimings("TB1");
    expect(timings.length).toBe(1);
    expect(timings[0]).toMatchObject({ day: "Mon", slotName: "TB1" });
  });
});

// --------------- toMinutes ---------------

describe("toMinutes", () => {
  it("converts 08:00 to 480", () => {
    expect(toMinutes("08:00")).toBe(480);
  });

  it("converts 14:30 to 870", () => {
    expect(toMinutes("14:30")).toBe(870);
  });

  it("converts 00:00 to 0", () => {
    expect(toMinutes("00:00")).toBe(0);
  });

  it("converts 23:59 to 1439", () => {
    expect(toMinutes("23:59")).toBe(1439);
  });

  it("converts 12:00 to 720", () => {
    expect(toMinutes("12:00")).toBe(720);
  });
});

// --------------- timesOverlap ---------------

describe("timesOverlap", () => {
  it("returns true when cells are the same", () => {
    const a = { cell: "l1", day: "Mon", start: "08:00", end: "08:50" };
    const b = { cell: "l1", day: "Mon", start: "08:00", end: "08:50" };
    expect(timesOverlap(a, b)).toBe(true);
  });

  it("returns false when cells differ", () => {
    const a = { cell: "l1", day: "Mon", start: "08:00", end: "08:50" };
    const b = { cell: "l2", day: "Mon", start: "08:50", end: "09:40" };
    expect(timesOverlap(a, b)).toBe(false);
  });

  it("detects overlap for theory+lab sharing the same cell", () => {
    // A1 and L1 both use cell l1 on Monday
    const a = { cell: "l1" };
    const b = { cell: "l1" };
    expect(timesOverlap(a, b)).toBe(true);
  });
});

// --------------- formatCourseTime ---------------

describe("formatCourseTime", () => {
  it("formats a standard timing object", () => {
    const timing = { day: "Mon", start: "08:00", end: "08:50" };
    expect(formatCourseTime(timing)).toBe("Monday, 08:00-08:50");
  });

  it("maps all known day abbreviations", () => {
    expect(formatCourseTime({ day: "Tue", start: "14:00", end: "14:50" })).toBe("Tuesday, 14:00-14:50");
    expect(formatCourseTime({ day: "Wed", start: "09:50", end: "10:40" })).toBe("Wednesday, 09:50-10:40");
    expect(formatCourseTime({ day: "Thu", start: "10:45", end: "11:35" })).toBe("Thursday, 10:45-11:35");
    expect(formatCourseTime({ day: "Fri", start: "11:40", end: "12:30" })).toBe("Friday, 11:40-12:30");
  });

  it("falls back to raw day string for unknown abbreviation", () => {
    expect(formatCourseTime({ day: "Sat", start: "08:00", end: "09:00" })).toBe("Sat, 08:00-09:00");
  });
});

// --------------- getCourseId ---------------

describe("getCourseId", () => {
  it("creates a pipe-delimited identifier", () => {
    const course = { code: "CSE101", slot: "A1+TA1", faculty: "Dr. X", title: "Intro" };
    expect(getCourseId(course)).toBe("CSE101|A1+TA1|Dr. X|Intro");
  });

  it("handles missing fields gracefully", () => {
    expect(getCourseId({ code: "CSE101" })).toBe("CSE101|||");
  });

  it("handles entirely empty course object", () => {
    expect(getCourseId({})).toBe("|||");
  });
});
