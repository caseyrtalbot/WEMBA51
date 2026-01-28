# Pathway Graph Builder Design

**Date:** 2026-01-28
**Status:** Draft
**Author:** Claude (with user collaboration)

## Overview

A visual, interactive graph-based interface for students to construct their WEMBA academic pathway. Students drag courses from a major-organized catalog into a node graph that displays prerequisite relationships, schedule conflicts, and progress toward graduation.

## Goals

- Provide an intuitive visual representation of the student's academic plan
- Show prerequisite relationships as connected nodes
- Enable drag-and-drop course planning
- Surface validation issues (missing prereqs, schedule conflicts) inline
- Help students understand how courses connect to their target majors

## Non-Goals

- Replacing the existing Explorer or Dashboard views
- Backend/database integration
- Multi-user collaboration features

---

## Layout Structure

### Split-View Interface

The pathway builder is a new view (replacing or augmenting the existing Pathway tab) with two main panels:

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Cohort Badge]    Total: 14.5/19.0 CU    [Major Progress Bars]    │
├──────────────────┬──────────────────────────────────────────────────┤
│                  │  ┌─────────────────────────────────────────────┐ │
│  COURSE CATALOG  │  │  Core Curriculum: 9.0 CU  [Expand ▼]       │ │
│                  │  ├─────────────────────────────────────────────┤ │
│  ▼ Finance       │  │                                             │ │
│    [Course]      │  │    T4          T5          T6               │ │
│    [Course]      │  │   ┌───┐      ┌───┐      ┌───┐              │ │
│    [Course]      │  │   │   │─────▶│   │─────▶│   │              │ │
│                  │  │   └───┘      └───┘      └───┘              │ │
│  ▼ Marketing     │  │      │                    ▲                 │ │
│    [Course]      │  │      └────────────────────┘                 │ │
│    [Course]      │  │                                             │ │
│                  │  │           PLAN GRAPH                        │ │
│  ▶ Management    │  │                                             │ │
│                  │  └─────────────────────────────────────────────┘ │
│    (~30%)        │                  (~70%)                          │
└──────────────────┴──────────────────────────────────────────────────┘
```

### Left Panel: Course Catalog (~30% width)

- **Organization:** Grouped by student's target majors (collapsible sections)
- **Course cards display:**
  - Course code and title
  - Credits (e.g., "1.0 CU")
  - Term badge (e.g., "T5")
  - Department color indicator
- **Visual states:**
  - Available: Full opacity, draggable
  - Already in plan: Checkmark, muted styling
  - Prerequisites not met: Lock icon, muted
- **Interaction:** Drag courses from catalog to plan graph

### Right Panel: Plan Graph (~70% width)

- **Structure:** SVG canvas with 6 vertical columns (T1-T6)
- **Core curriculum (T1-T3):** Collapsed into summary bar at top, expandable
- **Elective terms (T4-T6):** Main workspace with course nodes
- **Column headers show:**
  - Term name (e.g., "Term 4 - Summer 2026")
  - Total CUs planned in that term
  - Weekend dates (on hover)
- **Features:**
  - Zoom and pan controls
  - Drop zones for each term column
  - Prerequisite connection lines between nodes

### Header Bar

- Current cohort badge with switch option
- Total CU progress indicator (e.g., "14.5 / 19.0 CU")
- Target major mini progress bars
- Toggle to show/hide core curriculum detail

---

## Course Node Design

### Node Anatomy

Each course node is approximately 180px wide:

```
┌────────────────────────────┐
│██████████████████████████████│  ← Department color bar
├────────────────────────────┤
│  FNCE 7050                 │  ← Course code (bold)
│  Investment Management     │  ← Course title
├────────────────────────────┤
│  [1.0 CU]          [T5]    │  ← Credits and term badges
└────────────────────────────┘
```

### Node States

| State | Visual Treatment |
|-------|------------------|
| **Valid** | Solid border, full opacity |
| **Missing prerequisite** | Red dashed border, ⚠ icon in corner |
| **Schedule conflict** | Orange border, ⚡ icon in corner |
| **Selected** | Thicker border, subtle glow/shadow |
| **Dragging** | Slight scale-up (1.05x), drop shadow |
| **Core (locked)** | Gray tint, lock badge, no drag handle |

### Node Interactions

| Action | Behavior |
|--------|----------|
| **Click** | Select node, highlight prerequisite chain |
| **Double-click** | Open course detail modal |
| **Drag** | Move between T4-T6 columns (if offered) |
| **Right-click** | Context menu: "Remove", "View details" |
| **Hover** | Tooltip with professor and weekend schedule |

---

## Prerequisite Visualization

### Connection Lines

- **Default state:** Faded gray lines (30% opacity) connecting all prerequisite relationships
- **Arrow direction:** Points from prerequisite → dependent course (left to right)
- **Line style:** Curved bezier paths to avoid overlapping nodes

### Selection Highlighting

When a node is selected:

1. **Upstream chain (prerequisites):** Highlighted in **blue**
   - All courses that must be taken before this one
   - Arrows point toward selected node

2. **Downstream chain (unlocks):** Highlighted in **green**
   - All courses this one enables
   - Arrows point away from selected node

3. **Unrelated nodes:** Fade to 40% opacity

### Example

```
Selecting "FNCE 7050" highlights:

  [FNCE 6110]  ──blue──▶  [FNCE 7050]  ──green──▶  [FNCE 8920]
       │                    (selected)
       │
  [ACCT 6130]  ──blue──▶
```

---

## Drag-and-Drop Mechanics

### Dragging from Catalog

1. Student grabs a course card from the left panel
2. Card "lifts" with shadow effect and follows cursor
3. Valid drop columns highlight with green border
4. Invalid columns show red tint with explanation (e.g., "Not offered in T4")
5. Graph auto-scrolls when dragging near edges

### Drop Behavior

**On valid drop:**
1. Node animates into position within column
2. Prerequisite lines animate in, connecting to related courses
3. CU counters update (column header + total)
4. Validation runs immediately:
   - Missing prereqs → warning state applied
   - Schedule conflicts → warning state on all affected nodes

**On invalid drop:**
- Course snaps back to catalog with shake animation
- Brief tooltip explains why (e.g., "Already in plan")

### Removing Courses

Three removal methods:
1. **Drag out:** Drag node to trash icon that appears at graph bottom
2. **Context menu:** Right-click → "Remove from plan"
3. **Keyboard:** Select node → press Delete or Backspace

**On removal:**
1. Node fades out with animation
2. Connected prerequisite lines fade
3. Dependent courses update validation state
4. CU counters update

### Drop Restrictions

- Cannot drop on T1-T3 (core curriculum is fixed)
- Cannot add duplicate courses
- Cannot drop course in term where it's not offered

---

## Core Curriculum Display

### Collapsed State (Default)

Single summary bar at top of graph:

```
┌─────────────────────────────────────────────────────────────────┐
│  Core Curriculum: 9.0 CU (Philadelphia)    [Finance: FNCE 6110 ✓]  [▼ Expand]  │
└─────────────────────────────────────────────────────────────────┘
```

Shows:
- Total core CUs
- Cohort name
- Finance decision status (if applicable)
- Expand toggle

### Expanded State

Reveals three mini-columns for T1, T2, T3:

```
┌─────────────────────────────────────────────────────────────────┐
│  T1 (3.0 CU)         T2 (3.0 CU)         T3 (3.0 CU)           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ ACCT 6130    │    │ FNCE 6130    │    │ MGMT 6110    │      │
│  │ MGMT 6100    │    │ MKTG 6120    │    │ FNCE 6110 ▼  │ ← Toggle │
│  │ STAT 6210    │    │ ...          │    │ ...          │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                    [▲ Collapse] │
└─────────────────────────────────────────────────────────────────┘
```

- Core nodes appear with locked/gray styling
- T3 includes Finance Decision toggle (FNCE-6110 vs FNCE-6210)
- Changing finance choice updates catalog and validation

### Finance Decision Integration

For Philadelphia and San Francisco cohorts:
- Toggle appears in T3 section
- Selecting FNCE-6210 disables Finance major completion
- If Finance is a target major, warning indicator appears
- Catalog updates to reflect which advanced Finance courses are available

---

## Validation & Feedback

### Inline Node Warnings

Warnings appear directly on affected nodes:

**Missing Prerequisite:**
```
┌────────────────────────────┐
│████████████████████████████│
├───────────────────────[⚠]──┤  ← Red warning icon
│  FNCE 7050                 │
│  Investment Management     │     Border: red dashed
├────────────────────────────┤
│  [1.0 CU]          [T5]    │
└────────────────────────────┘

Tooltip: "Requires: FNCE 6110, ACCT 6130"
```

**Schedule Conflict:**
```
┌────────────────────────────┐
│████████████████████████████│
├───────────────────────[⚡]──┤  ← Orange warning icon
│  MGMT 6910                 │
│  Negotiations              │     Border: orange solid
├────────────────────────────┤
│  [0.5 CU]          [T5]    │
└────────────────────────────┘

Tooltip: "Overlaps with FNCE 7050 on weekends 3, 5"
```

**Multiple Issues:**
- Stack icons (⚠⚡)
- Tooltip lists all problems

### Graduation Progress

Header bar progress indicator:

```
Total: 14.5 / 19.0 CU  [████████████░░░░░░░░]
```

- Color coding:
  - Red: < 15 CU
  - Yellow: 15-18 CU
  - Green: ≥ 19 CU
- Click to see breakdown: "Core: 9.0 + Electives: 5.5 = 14.5 CU"

### Major Progress

Mini progress bars for each target major:

```
Finance ████████░░ 4.0/6.0 CU
Marketing ██████████ 3.0/3.0 CU ✓
```

---

## Responsive Behavior

### Desktop (>1024px)

- Full split-view layout
- Side-by-side catalog and graph
- Full drag-and-drop functionality
- Hover tooltips active

### Tablet (768-1024px)

- Catalog becomes slide-out drawer
- Toggle button to show/hide catalog
- Graph takes full width when drawer closed
- Drag-and-drop works when drawer open

### Mobile (<768px)

- Stacked layout: catalog above, graph below
- Both sections scrollable
- **Tap-to-place** replaces drag-and-drop:
  1. Tap course in catalog to select
  2. Tap target column in graph to place
- Pinch-to-zoom on graph canvas
- Tap node to select, tap again for detail modal

---

## Technical Implementation

### Architecture

Extend existing vanilla JS architecture (no external dependencies):

```
wemba-pathway-app/
├── index.html          (add graph container markup)
├── app.js              (extend state management)
├── pathway-graph.js    (NEW: graph rendering & interaction)
├── data.js             (no changes)
└── styles.css          (add graph-specific styles)
```

### Rendering Approach

**SVG-based rendering** (recommended over Canvas):
- Native DOM events for interaction
- CSS styling for states and animations
- Easier hit detection for nodes
- Accessible (screen reader compatible)
- Smooth scaling with zoom

### Component Structure

```javascript
// pathway-graph.js

class PathwayGraph {
  // Main SVG container, handles zoom/pan
  constructor(container, state)
  render()
  setZoom(level)
  panTo(x, y)
  selectNode(courseCode)
  clearSelection()
}

class TermColumn {
  // Manages a single term's drop zone and node layout
  constructor(term, courses)
  render()
  addNode(courseCode)
  removeNode(courseCode)
  handleDrop(event)
}

class CourseNode {
  // Individual course node rendering
  constructor(courseCode, courseData)
  render()
  setState(state)  // valid, warning, selected, etc.
  getConnections()
}

class ConnectionLine {
  // Prerequisite arrow rendering
  constructor(fromNode, toNode)
  render()
  highlight(type)  // 'upstream', 'downstream', 'none'
}

class CourseCatalog {
  // Left panel course list
  constructor(container, targetMajors)
  render()
  filterByMajor(majorId)
  setDragSource(courseCode)
}
```

### State Additions

```javascript
// Extend existing state object
state.graphView = {
  zoom: 1.0,
  panX: 0,
  panY: 0,
  selectedNode: null,      // courseCode or null
  coreExpanded: false,
  catalogDrawerOpen: true  // for responsive
}
```

### Key Functions

```javascript
// Graph-specific functions to add

function initPathwayGraph() {
  // Initialize SVG canvas and event listeners
}

function renderGraph() {
  // Full re-render of graph based on state
}

function layoutNodes(term) {
  // Calculate node positions within a term column
  // Vertical stacking with even spacing
}

function drawConnections() {
  // Render all prerequisite lines
  // Use bezier curves for smooth paths
}

function highlightPrerequisiteChain(courseCode) {
  // Find upstream and downstream courses
  // Apply highlight states
}

function handleNodeDrop(courseCode, targetTerm) {
  // Validate drop
  // Update state.plannedCourses
  // Re-render and validate
}

function getNodeValidationState(courseCode) {
  // Check prerequisites and schedule conflicts
  // Return: 'valid' | 'missing-prereq' | 'conflict' | 'multiple'
}
```

### Event Handling

```javascript
// Drag and drop events
catalog.addEventListener('dragstart', onCatalogDragStart)
graph.addEventListener('dragover', onGraphDragOver)
graph.addEventListener('drop', onGraphDrop)

// Node interactions
node.addEventListener('click', onNodeClick)
node.addEventListener('dblclick', onNodeDoubleClick)
node.addEventListener('contextmenu', onNodeContextMenu)

// Keyboard
document.addEventListener('keydown', onKeyDown)  // Delete key

// Touch (mobile)
node.addEventListener('touchstart', onNodeTouchStart)
column.addEventListener('touchend', onColumnTouchEnd)
```

---

## File Changes Summary

| File | Changes |
|------|---------|
| `index.html` | Add graph container, catalog panel markup, update nav |
| `app.js` | Extend state, add graph initialization, wire up events |
| `pathway-graph.js` | **New file:** All graph rendering and interaction logic |
| `styles.css` | Add graph styles, node states, responsive rules |

### Estimated Scope

- `pathway-graph.js`: ~600-800 lines
- `styles.css` additions: ~200 lines
- `index.html` additions: ~50 lines
- `app.js` modifications: ~100 lines

---

## Open Questions

1. **Zoom limits:** What min/max zoom levels feel usable? (Suggest: 0.5x to 2.0x)
2. **Auto-layout:** Should nodes auto-arrange or allow manual positioning within columns?
3. **Undo/redo:** Is undo functionality needed for plan changes?
4. **Export:** Should the graph view be exportable as an image?

---

## Success Criteria

- [ ] Students can drag courses from catalog to plan graph
- [ ] Prerequisite connections are visible and highlight on selection
- [ ] Validation warnings appear inline on affected nodes
- [ ] Core curriculum displays as collapsible summary
- [ ] CU progress updates in real-time
- [ ] Works on desktop, tablet, and mobile
- [ ] No external dependencies (vanilla JS/CSS/SVG)
