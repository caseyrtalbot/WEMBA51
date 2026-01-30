# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The WEMBA 51 Pathway Planner is a static web application that helps Wharton Executive MBA students plan their academic pathway to graduation. Students select their cohort (Philadelphia, San Francisco, or Global), explore courses by major or department, and build a hypothetical course plan to track progress toward 19.0 CU graduation requirements.

**Technology:** Plain HTML/CSS/JavaScript with no build tools or dependencies. Just open `index.html` in a browser.

## Running the App

```bash
# Python 3
python -m http.server 8000

# Or Node.js
npx http-server
```

Then open `http://localhost:8000` in a browser.

**Deployment:** Hosted on Vercel (see `.vercel/` config). Deploy by pushing to the connected repository.

## Architecture

```
index.html       →  DOM structure (cohort selection, main app views, modals)
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
  selectedCohort,         // 'philadelphia' | 'san_francisco' | 'global'
  plannedCourses,         // Array of course codes: ['FNCE-7050', 'MGMT-8010']
  targetMajors,           // Array of major IDs: ['finance', 'management']
  financeChoice,          // 'FNCE-6110' | 'FNCE-6210' (PHL/SF only)
  currentView,            // 'dashboard' | 'explorer' | 'pathway' | 'graph'
  explorerMode,           // 'majors' | 'departments'
  selectedMajor,
  selectedDepartment,
  completedBlockCourses,  // Early block courses taken during T1-T3
  waivedCourses           // Not fully implemented
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
- `slot` property (A, B, C, or combinations like 'A,A') indicates Wharton's slot system for conflict detection

**Early Block Courses (`EARLY_BLOCK_COURSES`)** are special block courses available for registration before Feb 15, taken during T1-T2. These are open to all cohorts.

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

**Schedule Conflicts:** Uses Wharton's slot system (A, B, C) for accurate conflict detection:
- Courses in the same term with the **same slot** conflict (A vs A, B vs B)
- Courses in **different slots** do NOT conflict even if weekends overlap (A vs B is OK)
- GMC/Block Week courses use date-based detection (same dates = conflict)
- `slotsConflict()` handles slot comparison; `getScheduleConflicts()` finds all conflicts

Slot assignments follow the schedule pattern:
- Slot A/B (first half): weekends `[0, 1, 2, 3]`
- Slot C (second half): weekends `[4, 5, 6]`
- Full term (A,A / B,B / C,C): weekends `[0, 1, 2, 3, 4, 5, 6, 7]`

**Prerequisites:** Each course can have a `prerequisites` array of course codes. `getMissingPrerequisites()` checks against planned courses + core curriculum.

## Cohort-Specific Behavior

All course availability filters through `state.selectedCohort`. The Global cohort:
- Has no FNCE-6110/6210 choice (always full 1.0 CU option)
- Hides the finance decision card on dashboard
- Has different course offerings and schedule than PHL/SF

## Curriculum Data Source

Data in `data.js` was synthesized from markdown files in the parent directory. When those source files are updated, `data.js` should be manually updated to reflect changes.
