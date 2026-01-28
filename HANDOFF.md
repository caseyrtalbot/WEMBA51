# WEMBA 51 Pathway Planner - Developer Handoff

**Version:** 1.0
**Created:** January 28, 2026
**Purpose:** Comprehensive documentation for iterating on and maintaining this application

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Application State](#application-state)
6. [Views & Components](#views--components)
7. [Key Functions Reference](#key-functions-reference)
8. [How to Add/Modify Features](#how-to-addmodify-features)
9. [Styling Guide](#styling-guide)
10. [Known Limitations](#known-limitations)
11. [Future Enhancement Ideas](#future-enhancement-ideas)
12. [Testing Checklist](#testing-checklist)
13. [Deployment](#deployment)

---

## Project Overview

### What This App Does

The WEMBA 51 Pathway Planner helps Wharton Executive MBA students plan their academic pathway to graduation. Students can:

- Select their cohort (Philadelphia, San Francisco, or Global)
- Explore courses by major or department
- Build a hypothetical course plan
- Track progress toward graduation (19.0 CU minimum)
- Track progress toward major requirements
- Export their plan

### Key Design Decisions

1. **Plain HTML/CSS/JS** - No build tools, no dependencies. Just open `index.html`.
2. **Planning tool, not tracker** - Shows "what if" scenarios, not actual completion status.
3. **Local storage persistence** - Plans save in browser without requiring a backend.
4. **Cohort-filtered data** - All courses filter to the selected cohort automatically.
5. **Static data** - Curriculum data is embedded in `data.js`, not fetched from an API.

### Technology Stack

- HTML5
- CSS3 (with CSS custom properties for theming)
- Vanilla JavaScript (ES6+)
- localStorage for persistence

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Cohort Selection│  │    Main App     │                  │
│  │     Screen      │  │  ┌───────────┐  │                  │
│  │                 │  │  │  Header   │  │                  │
│  │  [PHL][SF][GLO] │  │  ├───────────┤  │                  │
│  │                 │  │  │   Nav     │  │                  │
│  └─────────────────┘  │  ├───────────┤  │                  │
│                       │  │  Views:   │  │                  │
│                       │  │ -Dashboard│  │                  │
│                       │  │ -Explorer │  │                  │
│                       │  │ -Pathway  │  │                  │
│                       │  └───────────┘  │                  │
│                       └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         app.js                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  State   │  │  Event   │  │   View   │  │  Data    │   │
│  │ Manager  │  │ Handlers │  │ Updaters │  │ Helpers  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         data.js                             │
│  COHORTS │ COURSES │ MAJORS │ CORE_CURRICULUM │ SCHEDULE   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User selects cohort → `selectCohort()` updates state
2. State change triggers → `saveState()` to localStorage
3. View functions called → `updateDashboard()`, `updatePathway()`, etc.
4. DOM updated with new data
5. On page load → `loadState()` restores previous session

---

## File Structure

```
/wemba-pathway-app/
│
├── index.html          # Main HTML structure
│   ├── Cohort selection screen
│   ├── Main app container
│   │   ├── Header (cohort badge, CU summary)
│   │   ├── Navigation tabs
│   │   ├── Dashboard view
│   │   ├── Explorer view
│   │   └── Pathway view
│   └── Modals (course detail, add course)
│
├── styles.css          # All styling
│   ├── CSS variables (colors, shadows, etc.)
│   ├── Reset and base styles
│   ├── Cohort selection styles
│   ├── Header and navigation styles
│   ├── Dashboard components
│   ├── Explorer layout
│   ├── Pathway timeline
│   ├── Modal styles
│   └── Responsive breakpoints
│
├── data.js             # Curriculum data
│   ├── COHORTS         # Cohort definitions
│   ├── PROGRAM_RULES   # Graduation requirements
│   ├── DEPARTMENTS     # Department metadata
│   ├── CORE_CURRICULUM # Terms 1-3 courses by cohort
│   ├── COURSES         # All elective courses
│   ├── MAJORS          # Major requirements
│   ├── SCHEDULE        # Weekend dates by cohort
│   └── WAIVERS         # Waiver options
│
├── app.js              # Application logic
│   ├── State management
│   ├── Event listeners
│   ├── View update functions
│   ├── Course management
│   ├── Calculation helpers
│   └── Export functionality
│
└── HANDOFF.md          # This documentation
```

---

## Data Model

### COHORTS

```javascript
const COHORTS = {
  philadelphia: {
    id: 'philadelphia',
    name: 'Philadelphia (East)',
    shortName: 'PHL',
    format: 'In-Person',
    location: 'Philadelphia, PA'
  },
  // san_francisco, global...
};
```

### COURSES

Each course has offerings per cohort:

```javascript
const COURSES = {
  'FNCE-7050': {
    code: 'FNCE 7050',
    title: 'Investment Management',
    department: 'FNCE',
    credits: 1.0,
    offerings: {
      philadelphia: { term: 'T5', professor: 'Christopher Geczy' },
      san_francisco: { term: 'T5', professor: 'Christopher Geczy' },
      global: { term: 'T4', professor: 'Christopher Geczy' }
    }
  }
};
```

**Course code format:** `DEPT-XXXX` (e.g., `FNCE-7050`)

**Offering properties:**
- `term`: 'T4', 'T5', 'T6', or 'BW' (Block Week)
- `professor`: Professor name
- `dates`: (optional) Specific dates for block weeks
- `location`: (optional) Location for travel courses

### MAJORS

```javascript
const MAJORS = {
  finance: {
    id: 'finance',
    name: 'Finance',
    department: 'FNCE',
    requiredCUs: 6.0,
    stemCertified: true,
    description: 'Description text...',
    coreRequirements: ['FNCE-6110', 'FNCE-6130'],
    electiveCUs: 4.0,
    electiveCourses: ['FNCE-7030', 'FNCE-7050', ...],
    warnings: ['Must take FNCE 6110...'],
    restrictions: ['Cannot declare both Finance and Quantitative Finance']
  }
};
```

### CORE_CURRICULUM

Organized by cohort and term:

```javascript
const CORE_CURRICULUM = {
  philadelphia: {
    T1: [
      { code: 'ACCT-6130', title: '...', credits: 1.0, professor: 'TBD' },
      // ...
    ],
    T2: [...],
    T3: [...],
    T3_alternative: [
      { code: 'FNCE-6110', title: '...', credits: 1.0, replaces: 'FNCE-6210' }
    ]
  },
  // san_francisco, global...
};
```

---

## Application State

The application maintains a single state object:

```javascript
let state = {
  selectedCohort: null,        // 'philadelphia' | 'san_francisco' | 'global'
  plannedCourses: [],          // Array of course codes: ['FNCE-7050', 'MGMT-8010']
  targetMajors: [],            // Array of major IDs: ['finance', 'management']
  waivedCourses: [],           // Array of waived course codes (not fully implemented)
  financeChoice: null,         // 'FNCE-6110' | 'FNCE-6210' (for PHL/SF only)
  currentView: 'dashboard',    // 'dashboard' | 'explorer' | 'pathway'
  explorerMode: 'majors',      // 'majors' | 'departments'
  selectedMajor: null,         // Currently selected major in explorer
  selectedDepartment: null     // Currently selected department in explorer
};
```

### State Persistence

State is saved to `localStorage` under key `wemba-pathway-state`:

```javascript
function saveState() {
  localStorage.setItem('wemba-pathway-state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('wemba-pathway-state');
  if (saved) {
    state = { ...state, ...JSON.parse(saved) };
  }
}
```

---

## Views & Components

### 1. Cohort Selection Screen

**ID:** `#cohort-selection`

**Elements:**
- `.cohort-card[data-cohort]` - Clickable cohort cards

**Behavior:**
- Click card → `selectCohort(cohortId)` → shows main app

### 2. Dashboard View

**ID:** `#dashboard-view`

**Components:**

| Component | ID/Class | Purpose |
|-----------|----------|---------|
| Progress Card | `.progress-card` | Shows CU progress toward 19.0 |
| Major Card | `.major-card` | Shows target major progress |
| Finance Decision | `#finance-decision-card` | Term 3 FNCE choice (hidden for Global) |
| Alerts | `#alerts-list` | Dynamic warnings and info |
| Quick Actions | `.actions-card` | Navigation buttons |

**Key Functions:**
- `updateDashboard()` - Refreshes all dashboard components
- `updateMajorProgress()` - Updates major completion display
- `updateAlerts()` - Generates contextual alerts
- `generateAlerts()` - Returns array of alert objects

### 3. Explorer View

**ID:** `#explorer-view`

**Layout:**
```
┌──────────────┬────────────────────────────────────┐
│   Sidebar    │         Content Area               │
│              │                                    │
│ [Majors]     │  Title + Description               │
│ [Depts]      │                                    │
│              │  ┌────────┐ ┌────────┐ ┌────────┐ │
│ - Finance    │  │ Course │ │ Course │ │ Course │ │
│ - Marketing  │  │  Card  │ │  Card  │ │  Card  │ │
│ - Management │  └────────┘ └────────┘ └────────┘ │
│ - ...        │                                    │
│              │                                    │
│ [Search]     │                                    │
└──────────────┴────────────────────────────────────┘
```

**Key Functions:**
- `setBrowseMode(mode)` - Toggle between majors/departments
- `populateSidebar()` - Populates both sidebar lists
- `selectMajor(majorId)` - Shows major's courses
- `selectDepartment(deptCode)` - Shows department's courses
- `displayMajorCourses(majorId)` - Renders course cards for major
- `displayDepartmentCourses(deptCode)` - Renders course cards for dept
- `createCourseCard(course)` - Returns HTML for a course card
- `filterCourses(query)` - Search functionality

### 4. Pathway View

**ID:** `#pathway-view`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Header: Total CU | Status | Major(s)                   │
├─────────────────────────────────────────────────────────┤
│  Year 1 - Core Curriculum                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ Term 1  │  │ Term 2  │  │ Term 3  │                 │
│  │ 3.5 CU  │  │ 3.0 CU  │  │ 2.5 CU  │                 │
│  │ [cores] │  │ [cores] │  │ [cores] │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
├─────────────────────────────────────────────────────────┤
│  Year 2 - Electives                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ Term 4  │  │ Term 5  │  │ Term 6  │                 │
│  │ [+ Add] │  │ [+ Add] │  │ [+ Add] │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
├─────────────────────────────────────────────────────────┤
│  Block Weeks                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Block Week courses [+ Add]                       │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  Validation Messages                                    │
└─────────────────────────────────────────────────────────┘
```

**Key Functions:**
- `updatePathway()` - Refreshes entire pathway view
- `getPlannedCoursesForTerm(term)` - Returns courses for a specific term
- `updateValidation()` - Shows/hides validation messages

### 5. Modals

**Course Detail Modal:** `#course-modal`
- Shows full course info
- Add/remove button

**Add Course Modal:** `#add-course-modal`
- Lists available courses for a specific term
- Click to add and close

---

## Key Functions Reference

### State Management

| Function | Purpose |
|----------|---------|
| `saveState()` | Saves state to localStorage |
| `loadState()` | Restores state from localStorage |
| `selectCohort(id)` | Sets selected cohort, initializes app |

### Course Management

| Function | Purpose |
|----------|---------|
| `addCourse(code)` | Adds course to `state.plannedCourses` |
| `removeCourse(code)` | Removes course from plan |
| `toggleTargetMajor(id)` | Adds/removes major from targets |

### Calculations

| Function | Returns |
|----------|---------|
| `calculateTotalCU()` | Total CUs in plan (core + electives) |
| `calculateMajorProgress(majorId)` | `{ completed, required }` object |
| `getPlannedCoursesForTerm(term)` | Array of course objects for term |
| `getCoursesForDepartment(deptCode)` | Array of courses in department |

### View Updates

| Function | Updates |
|----------|---------|
| `updateDashboard()` | All dashboard components |
| `updatePathway()` | Entire pathway timeline |
| `updateMajorProgress()` | Major progress card |
| `updateAlerts()` | Alerts list |
| `updateValidation()` | Pathway validation messages |
| `updateCohortDisplay()` | Header cohort badge |
| `updateFinanceDecision()` | Finance decision buttons |

### UI Helpers

| Function | Purpose |
|----------|---------|
| `switchView(viewName)` | Changes active view |
| `setBrowseMode(mode)` | Toggles majors/departments in explorer |
| `showCourseDetails(code)` | Opens course detail modal |
| `addCourseToTerm(term)` | Opens add course modal for term |
| `closeModal()` | Closes course detail modal |
| `closeAddCourseModal()` | Closes add course modal |
| `exportPlan()` | Downloads plan as text file |
| `clearElectives()` | Removes all planned electives |

---

## How to Add/Modify Features

### Adding a New Course

1. Open `data.js`
2. Add entry to `COURSES` object:

```javascript
'FNCE-9999': {
  code: 'FNCE 9999',
  title: 'New Finance Course',
  department: 'FNCE',
  credits: 0.5,
  offerings: {
    philadelphia: { term: 'T5', professor: 'Professor Name' },
    // Add other cohorts if available
  }
}
```

3. If it counts toward a major, add the code to that major's `electiveCourses` array

### Adding a New Major

1. Open `data.js`
2. Add entry to `MAJORS` object:

```javascript
new_major: {
  id: 'new_major',
  name: 'New Major Name',
  department: 'DEPT',
  requiredCUs: 4.0,
  stemCertified: false,
  description: 'Description here',
  coreRequirements: [],
  electiveCUs: 4.0,
  electiveCourses: ['COURSE-1', 'COURSE-2'],
  warnings: [],
  restrictions: []
}
```

### Adding a New View

1. In `index.html`, add new `<main id="newview-view" class="view">` section
2. Add navigation tab: `<button class="nav-tab" data-view="newview">New View</button>`
3. In `app.js`, add update function: `function updateNewView() { ... }`
4. Call update function in `switchView()` when view is activated

### Modifying the Finance Decision Logic

The Term 3 finance choice is handled in several places:

1. **State:** `state.financeChoice` ('FNCE-6110' or 'FNCE-6210')
2. **UI:** `#finance-decision-card` in dashboard (hidden for Global)
3. **Calculation:** `calculateTotalCU()` adds extra 0.5 CU for FNCE-6110
4. **Pathway:** `updatePathway()` swaps courses in Term 3 display
5. **Validation:** `generateAlerts()` warns if Finance major + FNCE-6210

### Adding Schedule Conflict Detection

Currently not implemented. To add:

1. Add `weekend` or `half` property to course offerings in `data.js`
2. Create `detectConflicts(plannedCourses)` function in `app.js`
3. Call from `updateValidation()` to show conflict warnings
4. Consider adding visual indicators in pathway view

---

## Styling Guide

### CSS Variables

```css
:root {
  --primary: #1e40af;        /* Main brand color */
  --primary-dark: #1e3a8a;   /* Hover states */
  --primary-light: #3b82f6;  /* Accents */
  --secondary: #64748b;      /* Secondary text */
  --success: #059669;        /* Success states */
  --warning: #d97706;        /* Warning states */
  --danger: #dc2626;         /* Error states */
  --background: #f8fafc;     /* Page background */
  --surface: #ffffff;        /* Card backgrounds */
  --text: #1e293b;           /* Primary text */
  --text-secondary: #64748b; /* Secondary text */
  --border: #e2e8f0;         /* Borders */
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);
  --radius: 8px;             /* Standard border radius */
  --radius-lg: 12px;         /* Large border radius */
}
```

### Department Colors

Each department has a color class:

```css
.dept-FNCE { color: #2563eb; }  /* Blue */
.dept-MGMT { color: #7c3aed; }  /* Purple */
.dept-MKTG { color: #db2777; }  /* Pink */
.dept-OIDD { color: #059669; }  /* Green */
.dept-ACCT { color: #d97706; }  /* Orange */
.dept-STAT { color: #0891b2; }  /* Cyan */
.dept-LGST { color: #4f46e5; }  /* Indigo */
.dept-HCMG { color: #dc2626; }  /* Red */
.dept-REAL { color: #65a30d; }  /* Lime */
```

### Component Classes

| Class | Purpose |
|-------|---------|
| `.card` | Standard card container |
| `.btn-primary` | Primary action button |
| `.btn-secondary` | Secondary action button |
| `.status-badge.ready` | Green success badge |
| `.status-badge.pending` | Yellow warning badge |
| `.alert-item.info` | Blue info alert |
| `.alert-item.warning` | Yellow warning alert |
| `.alert-item.success` | Green success alert |
| `.alert-item.error` | Red error alert |
| `.course-card` | Course display card |
| `.course-card.in-plan` | Course already in plan |
| `.term-card` | Term display in pathway |
| `.empty-state` | Empty state message |

### Responsive Breakpoints

```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

---

## Known Limitations

### Data Completeness

1. **Course descriptions** - Not included in data. Only titles.
2. **Prerequisites** - Not tracked or validated.
3. **Waiver functionality** - Data structure exists but UI not implemented.
4. **Cross-cohort courses** - Not handled (taking SF course while in PHL).
5. **GMC courses** - Global Modular Courses not included.

### Functionality Gaps

1. **No schedule conflict detection** - Courses in same weekend not flagged.
2. **No GPA tracking** - Pass/fail implications not calculated.
3. **No course capacity** - All courses shown as available.
4. **Single plan only** - Cannot save/compare multiple plans.
5. **No undo** - No way to undo accidental removals.

### Browser Support

- Requires modern browser with ES6+ support
- localStorage required (won't work in private/incognito mode on some browsers)
- Not tested on Internet Explorer

---

## Future Enhancement Ideas

### High Priority

1. **Schedule conflict detection**
   - Add weekend data to offerings
   - Warn when two courses overlap

2. **Course descriptions**
   - Add description field to COURSES
   - Show in course detail modal

3. **Prerequisites validation**
   - Add prereq field to COURSES
   - Warn if prereq not in plan

4. **Shareable URL**
   - Encode plan in URL parameters
   - Share link that restores plan

### Medium Priority

5. **Multiple plans**
   - Save/load named plans
   - Compare two plans side-by-side

6. **Calendar export**
   - Generate ICS file with weekend dates
   - Import to Google Calendar, etc.

7. **Print stylesheet**
   - Optimize pathway view for printing

8. **Waiver implementation**
   - UI to mark courses as waived
   - Replace with elective credit

### Nice to Have

9. **Dark mode**
   - Use CSS variables for theming
   - Toggle in header

10. **Professor ratings**
    - Link to course evaluation data

11. **Course recommendations**
    - "Students who took X also took Y"

12. **Mobile app wrapper**
    - PWA with offline support

---

## Testing Checklist

### Cohort Selection

- [ ] Clicking each cohort card selects it
- [ ] Cohort badge shows correct name
- [ ] Clicking cohort badge returns to selection

### Dashboard

- [ ] Progress bar updates when courses added/removed
- [ ] CU count is accurate
- [ ] Graduation status changes at 19.0 CU
- [ ] Finance decision card hidden for Global
- [ ] Finance decision persists after selection
- [ ] Alerts update appropriately
- [ ] Major progress shows when major selected

### Explorer

- [ ] Majors list populated correctly
- [ ] Departments list populated correctly
- [ ] Toggle between majors/departments works
- [ ] Selecting major shows its courses
- [ ] Selecting department shows its courses
- [ ] Search filters courses correctly
- [ ] Add button adds course to plan
- [ ] Remove button removes course from plan
- [ ] Course cards show "in-plan" state
- [ ] Details button opens modal
- [ ] "Set as Target Major" button works

### Pathway

- [ ] Terms 1-3 show core curriculum
- [ ] Term 3 shows correct finance course based on choice
- [ ] Terms 4-6 show planned electives
- [ ] Block weeks section shows BW courses
- [ ] Add course button opens modal with term's courses
- [ ] Remove button removes course
- [ ] CU totals accurate per term
- [ ] Pathway stats accurate
- [ ] Validation messages show/hide appropriately

### Persistence

- [ ] Plan survives page refresh
- [ ] Cohort selection survives refresh
- [ ] Finance choice survives refresh
- [ ] Target majors survive refresh
- [ ] Clear electives works

### Export

- [ ] Export button downloads file
- [ ] File contains accurate plan data

### Responsive

- [ ] App usable on mobile (768px and below)
- [ ] No horizontal scroll
- [ ] Touch targets adequate size

---

## Deployment

### Static Hosting

The app can be hosted on any static file server:

**GitHub Pages:**
1. Push to GitHub repository
2. Enable Pages in repo settings
3. Select branch and folder

**Vercel:**
1. Connect repository
2. Deploy (no build step needed)

**Netlify:**
1. Drag and drop folder
2. Or connect repository

**Simple HTTP Server (local):**
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server installed)
npx http-server
```

### Updates

To update curriculum data:

1. Edit `data.js` with new courses, majors, or schedule changes
2. Test locally
3. Deploy updated file

No build step required - just replace the file.

---

## Source Data Files

The curriculum data was synthesized from these markdown files in the parent directory:

| File | Content |
|------|---------|
| `WEMBA_51_Cohort_Guide.md` | Term-by-term curriculum by cohort |
| `WEMBA_51_Master_Curriculum.md` | Canonical curriculum with comparison matrix |
| `WEMBA51_Electives_By_Cohort.md` | Detailed Year 2 elective schedules |
| `wharton_emba_cohort51_curriculum_guide.md` | Complete data with calendar and professor index |
| `wharton_mba_majors_requirements.md` | All 21 Wharton MBA major requirements |

When these source files are updated, `data.js` should be regenerated or manually updated to reflect changes.

---

## Contact & Support

This application was built as a planning tool for WEMBA 51 students. For curriculum questions, contact the Wharton EMBA program office.

For technical issues with the application, refer to this documentation or the source code comments.

---

*Last updated: January 28, 2026*
