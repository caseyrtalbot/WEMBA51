# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The WEMBA 51 Pathway Planner is a static web application that helps Wharton Executive MBA students plan their academic pathway to graduation. Students select their cohort (Philadelphia, San Francisco, or Global), explore courses by major or department, and build a hypothetical course plan to track progress toward 19.0 CU graduation requirements.

**Technology:** Plain HTML/CSS/JavaScript with no build tools or dependencies.

## Commands

```bash
# Run local server (for manual testing)
npm run serve              # python -m http.server 8000
npm run serve:npx          # npx http-server -p 8000

# Run Playwright tests (auto-starts dev server - no manual server needed)
npm test                   # all tests, all browsers
npm run test:ui            # interactive UI mode
npm run test:headed        # headed browser mode
npm run test:debug         # debug mode with inspector
npx playwright test tests/e2e/navigation.spec.js  # single file
```

**Why tests use localhost instead of file://:** The Playwright config auto-starts a Python http server. This is intentional because:
- Firefox has strict security restrictions with `file://` that break localStorage
- Cross-browser localStorage behavior varies with `file://` protocol
- No manual steps needed - `npm test` handles everything

**Deployment:** Hosted on Vercel. Deploy by pushing to the connected repository.

## Architecture

```
index.html       →  DOM structure (cohort selection, main app views, modals)
     ↓
router.js        →  Hash-based URL routing, browser history, route guards
     ↓
app.js           →  State management, event handlers, view updates, validation
     ↓
pathway-graph.js →  PathwayGraph class for interactive SVG visualization
     ↓
data.js          →  Static curriculum data (COHORTS, COURSES, MAJORS, CORE_CURRICULUM, SCHEDULE)
     ↓
styles.css       →  CSS custom properties for theming, responsive breakpoints at 768px
```

### State Management

Single global `state` object persisted to `localStorage` under key `wemba-pathway-state`:

```javascript
state = {
  selectedCohort,     // 'philadelphia' | 'san_francisco' | 'global'
  plannedCourses,     // Array of course codes: ['FNCE-7050', 'MGMT-8010']
  targetMajors,       // Array of major IDs: ['finance', 'management']
  financeChoice,      // 'FNCE-6110' | 'FNCE-6210' (PHL/SF only)
  currentView,        // 'dashboard' | 'explorer' | 'pathway' | 'graph'
  explorerMode,       // 'majors' | 'departments'
  selectedMajor,
  selectedDepartment,
  waivedCourses       // Not fully implemented
}
```

### Data Flow

1. User action → state update → `saveState()` to localStorage
2. State change → view update functions (`updateDashboard()`, `updatePathway()`, `renderGraphView()`, etc.)
3. On page load → `loadState()` restores previous session

### Key Data Structures

**Course structure with all fields:**
```javascript
COURSES['FNCE-7050'] = {
  code: 'FNCE 7050',
  title: 'Investment Management',
  description: 'Survey of investment strategies...',
  department: 'FNCE',
  credits: 1.0,
  prerequisites: ['FNCE-6110'],  // Course codes, validated against plan
  offerings: {
    philadelphia: { term: 'T5', professor: 'Christopher Geczy', weekends: [0,1,2,3,4,5,6,7] },
    san_francisco: { term: 'T5', professor: 'Christopher Geczy', weekends: [0,1,2,3,4,5,6,7] },
    global: { term: 'T4', professor: 'Christopher Geczy', weekends: [0,1,2,3,4,5,6,7] }
  }
}
```

- `weekends` array: 0-based indices into `SCHEDULE[cohort][term].weekends` for conflict detection
- Block Week courses use `dates` string instead of `weekends` array

**Core curriculum (`CORE_CURRICULUM`) is organized by cohort and term (T1, T2, T3).**

**The Term 3 finance choice (FNCE-6110 vs FNCE-6210) is a key decision point** that affects:
- Total CU calculation (0.5 CU difference)
- Finance major eligibility (requires FNCE-6110)
- The Global cohort has no choice (always FNCE-6110)

### Views

- **Dashboard:** Progress toward 19.0 CU, major progress, alerts, finance decision card
- **Explorer:** Browse courses by major or department, search, add/remove from plan
- **Pathway:** Timeline view of Terms 1-6 plus Block Weeks, validation messages
- **Graph Builder:** Interactive SVG-based visualization of course plan with drag-and-drop, prerequisites, and conflict detection

## Graph Builder (pathway-graph.js)

The `PathwayGraph` class provides an interactive visualization:

```javascript
GRAPH_CONFIG = {
  nodeWidth: 170, nodeHeight: 70,
  columnWidth: 220, columnGap: 40,
  minZoom: 0.5, maxZoom: 2.0
}
```

Key features:
- Drag courses from catalog to term columns
- Prerequisite arrows (blue) and unlock arrows (green)
- Schedule conflict detection with visual indicators
- Major filtering modes: 'all', 'highlight', 'filter'
- Zoom/pan controls, interactive legend

Department colors are defined in `DEPT_COLORS` object matching `DEPARTMENTS` in data.js.

## Key Functions

| Function | Purpose |
|----------|---------|
| `calculateTotalCU()` | Sums core + elective CUs, handles finance choice |
| `calculateMajorProgress(majorId)` | Returns `{ completed, required }` for major tracking |
| `getPlannedCoursesForTerm(term)` | Filters `state.plannedCourses` by term offering |
| `generateAlerts()` | Returns array of warnings/info including conflicts and prereqs |
| `getScheduleConflicts()` | Detects courses with overlapping weekend schedules |
| `getMissingPrerequisites()` | Checks planned courses against their prerequisites |
| `getPrerequisiteInfo(courseCode)` | Returns prereq status for modal display |
| `renderGraphView()` | Renders/refreshes the Graph Builder view |

## Validation Features

**Schedule Conflicts (Slot-Based):** Courses use Wharton's slot system (A, B, C) for conflict detection:
- Same term + same slot letter → **conflict** (e.g., two slot A courses in T4)
- Same term + different slots → **no conflict** (e.g., slot A + slot B in T4)
- Slot-to-weekends mapping: Slot A/B = weekends `[0,1,2,3]`, Slot C = `[4,5,6]`
- GMC/Block Week courses use date-based detection instead

Checked via `slotsConflict()` and `getScheduleConflicts()` in app.js.

**Prerequisites:** Each course can have a `prerequisites` array of course codes. `getMissingPrerequisites()` checks against planned courses + core curriculum.

## Cohort-Specific Behavior

All course availability filters through `state.selectedCohort`. The Global cohort:
- Has no FNCE-6110/6210 choice (always full 1.0 CU option)
- Hides the finance decision card on dashboard
- Has different course offerings and schedule than PHL/SF

## Curriculum Data Source

Data in `data.js` was synthesized from markdown files in the parent directory. When those source files are updated, `data.js` should be manually updated to reflect changes.

## Documentation

- `HANDOFF.md` - Context handoff notes for recent features (e.g., slot-based conflict detection)
- `docs/plans/` - Design documents for major features like Graph Builder
- `tests/e2e/` - Playwright E2E tests (navigation, cohort, explorer, pathway, dashboard, graph-builder)
