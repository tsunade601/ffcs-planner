/**
 * Test setup helper: loads script.js into the jsdom global scope.
 *
 * Provides a minimal DOM skeleton and stubs for browser APIs
 * (fetch, localStorage, html2canvas, confirm) so that the script
 * can be evaluated without errors.  After requiring this module
 * every function declared in script.js is available on `global`.
 */

const fs = require("fs");
const path = require("path");

let loaded = false;

function loadScript() {
  if (loaded) return;
  loaded = true;

  // Minimal DOM elements referenced during initialisation
  const ids = [
    "courseList",
    "courseCount",
    "searchInput",
    "sortSelect",
    "selectedCourses",
    "timetable",
    "selectedCount",
    "totalCredits",
    "stats",
  ];

  for (const id of ids) {
    if (!document.getElementById(id)) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
  }

  // Stub localStorage
  const store = {};
  const localStorageMock = {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, value) => { store[key] = String(value); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
  };
  Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });

  // Stub fetch (returns empty array by default)
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );

  // Stub html2canvas
  global.html2canvas = jest.fn(() =>
    Promise.resolve({ toDataURL: () => "data:image/png;base64,stub" })
  );

  // Stub confirm
  global.confirm = jest.fn(() => true);

  // Stub requestAnimationFrame (not available in basic jsdom)
  if (typeof global.requestAnimationFrame === "undefined") {
    global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  }

  // Load and execute script.js via eval so that jsdom globals are in scope
  const scriptPath = path.resolve(__dirname, "..", "script.js");
  let code = fs.readFileSync(scriptPath, "utf-8");

  // Disable the DOMContentLoaded auto-init to avoid side effects
  code = code.replace(
    /window\.addEventListener\(\s*["']DOMContentLoaded["']/,
    "window.addEventListener('__noop__'"
  );

  // Convert top-level let/const state variables to var so they become
  // true globals accessible from test code.
  code = code.replace(/^let allCourses/m, "var allCourses");
  code = code.replace(/^let selectedCourses/m, "var selectedCourses");
  code = code.replace(/^let currentFilter/m, "var currentFilter");
  code = code.replace(/^let currentTypeFilter/m, "var currentTypeFilter");
  code = code.replace(/^let currentSort/m, "var currentSort");
  code = code.replace(/^const STORAGE_KEY/m, "var STORAGE_KEY");
  code = code.replace(/^const DAYS/m, "var DAYS");
  code = code.replace(/^const DAY_LABELS/m, "var DAY_LABELS");
  code = code.replace(/^const THEORY_PERIODS/m, "var THEORY_PERIODS");
  code = code.replace(/^const AFTERNOON_PERIODS/m, "var AFTERNOON_PERIODS");
  code = code.replace(/^const LAB_AM_TIMES/m, "var LAB_AM_TIMES");
  code = code.replace(/^const LAB_PM_TIMES/m, "var LAB_PM_TIMES");
  code = code.replace(/^const SLOT_MAP/m, "var SLOT_MAP");
  code = code.replace(/^const COLORS/m, "var COLORS");

  // eval in global scope so all functions become global
  const geval = eval;
  geval(code);
}

module.exports = { loadScript };
