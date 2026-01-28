# Pathway Graph Builder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive SVG-based node graph for students to visually construct their academic pathway with drag-and-drop course placement and prerequisite visualization.

**Architecture:** Split-view interface with a major-grouped course catalog on the left and an SVG graph canvas on the right. Courses are nodes organized in term columns (T4-T6), connected by prerequisite lines. Core curriculum (T1-T3) shown as collapsible summary. All rendering via SVG for native DOM events and CSS styling.

**Tech Stack:** Vanilla JavaScript, SVG, CSS (no dependencies)

---

## Task 1: Add Graph View HTML Structure

**Files:**
- Modify: `index.html:172-304` (pathway-view section)

**Step 1: Add new nav tab for Graph Builder**

In `index.html`, find line 69 and add a new tab:

```html
<nav class="main-nav">
  <button class="nav-tab active" data-view="dashboard">Dashboard</button>
  <button class="nav-tab" data-view="explorer">Explorer</button>
  <button class="nav-tab" data-view="pathway">My Pathway</button>
  <button class="nav-tab" data-view="graph">Graph Builder</button>
</nav>
```

**Step 2: Add graph-view section after pathway-view (after line 304)**

```html
<!-- Graph Builder View -->
<main id="graph-view" class="view">
  <div class="graph-layout">
    <!-- Course Catalog Panel -->
    <aside class="graph-catalog">
      <div class="catalog-header">
        <h3>Course Catalog</h3>
        <p class="catalog-subtitle">Drag courses to your plan</p>
      </div>
      <div id="catalog-majors" class="catalog-sections">
        <!-- Populated by JS: collapsible major sections -->
      </div>
      <div class="catalog-empty-state" id="catalog-empty">
        <p>Select target majors in Explorer to see relevant courses here</p>
      </div>
    </aside>

    <!-- Graph Canvas Panel -->
    <div class="graph-panel">
      <!-- Core Curriculum Summary Bar -->
      <div class="core-summary" id="core-summary">
        <div class="core-summary-collapsed" id="core-collapsed">
          <span class="core-label">Core Curriculum: <strong id="core-cu-total">9.0 CU</strong></span>
          <span class="core-cohort" id="core-cohort-name">Philadelphia</span>
          <span class="finance-indicator" id="finance-indicator"></span>
          <button class="core-expand-btn" id="core-expand-btn">Expand</button>
        </div>
        <div class="core-summary-expanded hidden" id="core-expanded">
          <div class="core-terms">
            <div class="core-term" id="core-T1"></div>
            <div class="core-term" id="core-T2"></div>
            <div class="core-term" id="core-T3"></div>
          </div>
          <button class="core-collapse-btn" id="core-collapse-btn">Collapse</button>
        </div>
      </div>

      <!-- SVG Graph Canvas -->
      <div class="graph-canvas-container" id="graph-canvas-container">
        <svg id="pathway-graph" class="pathway-graph">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
            <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
            </marker>
          </defs>
          <!-- Connection lines layer -->
          <g id="connections-layer"></g>
          <!-- Nodes layer -->
          <g id="nodes-layer"></g>
          <!-- Drop zone indicators -->
          <g id="dropzones-layer"></g>
        </svg>
      </div>

      <!-- Graph Controls -->
      <div class="graph-controls">
        <button class="graph-control-btn" id="zoom-in-btn" title="Zoom In">+</button>
        <button class="graph-control-btn" id="zoom-out-btn" title="Zoom Out">−</button>
        <button class="graph-control-btn" id="zoom-reset-btn" title="Reset View">⟲</button>
        <span class="zoom-level" id="zoom-level">100%</span>
      </div>

      <!-- Graph Header Stats -->
      <div class="graph-header-stats">
        <div class="graph-stat">
          <span class="graph-stat-value" id="graph-total-cu">9.0</span>
          <span class="graph-stat-label">/ 19.0 CU</span>
        </div>
        <div class="graph-major-progress" id="graph-major-progress">
          <!-- Mini progress bars for target majors -->
        </div>
      </div>
    </div>
  </div>

  <!-- Trash Drop Zone (appears when dragging) -->
  <div class="trash-dropzone hidden" id="trash-dropzone">
    <span>Drop to remove</span>
  </div>
</main>
```

**Step 3: Add script tag for pathway-graph.js before app.js**

Find line 330-331 and update:

```html
<script src="data.js"></script>
<script src="pathway-graph.js"></script>
<script src="app.js"></script>
```

**Step 4: Verify changes**

Open `index.html` in browser, confirm:
- "Graph Builder" tab appears in navigation
- Clicking it shows empty graph view structure
- No console errors

---

## Task 2: Add Graph View CSS Styles

**Files:**
- Modify: `styles.css` (append at end)

**Step 1: Add graph layout styles**

Append to `styles.css`:

```css
/* ============================================
   GRAPH BUILDER VIEW
   ============================================ */

/* Layout */
.graph-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  height: calc(100vh - 140px);
  max-height: calc(100vh - 140px);
  overflow: hidden;
}

/* Course Catalog Panel */
.graph-catalog {
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.catalog-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.catalog-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.catalog-subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.catalog-sections {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.catalog-empty-state {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Catalog Major Sections */
.catalog-major {
  margin-bottom: 0.5rem;
}

.catalog-major-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--background);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s;
}

.catalog-major-header:hover {
  background: var(--border);
}

.catalog-major-header h4 {
  font-size: 0.875rem;
  font-weight: 500;
}

.catalog-major-header .badge {
  background: var(--primary);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
}

.catalog-major-header .chevron {
  transition: transform 0.2s;
}

.catalog-major.collapsed .chevron {
  transform: rotate(-90deg);
}

.catalog-major.collapsed .catalog-courses {
  display: none;
}

.catalog-courses {
  padding: 0.5rem 0;
}

/* Catalog Course Card (draggable) */
.catalog-course {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 0.375rem;
  cursor: grab;
  transition: box-shadow 0.2s, border-color 0.2s, opacity 0.2s;
}

.catalog-course:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow);
}

.catalog-course.in-plan {
  opacity: 0.5;
  cursor: default;
  background: #f0fdf4;
  border-color: var(--success);
}

.catalog-course.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.catalog-course.dragging {
  opacity: 0.5;
}

.catalog-course-color {
  width: 4px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;
}

.catalog-course-info {
  flex: 1;
  min-width: 0;
}

.catalog-course-code {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text);
}

.catalog-course-title {
  font-size: 0.7rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.catalog-course-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  flex-shrink: 0;
}

.catalog-course-credits {
  font-size: 0.65rem;
  font-weight: 600;
  background: var(--background);
  padding: 0.125rem 0.375rem;
  border-radius: 999px;
}

.catalog-course-term {
  font-size: 0.6rem;
  color: var(--text-secondary);
}

.catalog-course-status {
  font-size: 0.65rem;
}

.catalog-course-status.added {
  color: var(--success);
}

.catalog-course-status.locked {
  color: var(--text-secondary);
}
```

**Step 2: Add graph panel styles**

Continue appending to `styles.css`:

```css
/* Graph Panel */
.graph-panel {
  position: relative;
  background: var(--background);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Core Curriculum Summary */
.core-summary {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 1rem;
}

.core-summary-collapsed {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.core-label {
  font-size: 0.875rem;
}

.core-cohort {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.finance-indicator {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.finance-indicator.warning {
  color: var(--warning);
}

.core-expand-btn,
.core-collapse-btn {
  margin-left: auto;
  background: var(--background);
  border: 1px solid var(--border);
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.core-expand-btn:hover,
.core-collapse-btn:hover {
  background: var(--border);
}

.core-summary-expanded {
  padding-top: 0.75rem;
}

.core-summary-expanded.hidden {
  display: none;
}

.core-terms {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.core-term {
  background: var(--background);
  border-radius: var(--radius);
  padding: 0.75rem;
}

.core-term h5 {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.core-term-course {
  font-size: 0.75rem;
  padding: 0.25rem 0;
  color: var(--text);
  display: flex;
  justify-content: space-between;
}

.core-term-course span {
  color: var(--text-secondary);
}
```

**Step 3: Add SVG graph canvas styles**

Continue appending:

```css
/* SVG Graph Canvas */
.graph-canvas-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.pathway-graph {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.pathway-graph.panning {
  cursor: grabbing;
}

/* Term Column Headers */
.term-column-header {
  fill: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.term-column-subheader {
  fill: var(--text-secondary);
  font-size: 11px;
}

/* Drop Zones */
.term-dropzone {
  fill: transparent;
  stroke: transparent;
  stroke-width: 2;
  stroke-dasharray: 8 4;
  rx: 8;
  transition: fill 0.2s, stroke 0.2s;
}

.term-dropzone.active {
  fill: rgba(59, 130, 246, 0.05);
  stroke: var(--primary);
}

.term-dropzone.invalid {
  fill: rgba(220, 38, 38, 0.05);
  stroke: var(--danger);
}

/* Course Nodes */
.course-node {
  cursor: pointer;
  transition: transform 0.1s;
}

.course-node:hover {
  filter: brightness(0.98);
}

.course-node.selected .node-border {
  stroke: var(--primary);
  stroke-width: 3;
}

.course-node.dragging {
  opacity: 0.8;
  cursor: grabbing;
}

.node-bg {
  fill: var(--surface);
  stroke: var(--border);
  stroke-width: 1;
  rx: 8;
}

.node-border {
  fill: none;
  stroke: transparent;
  stroke-width: 2;
  rx: 8;
}

.node-dept-bar {
  rx: 8 8 0 0;
}

.node-code {
  font-size: 11px;
  font-weight: 600;
  fill: var(--text);
}

.node-title {
  font-size: 10px;
  fill: var(--text-secondary);
}

.node-credits {
  font-size: 9px;
  font-weight: 600;
  fill: var(--text-secondary);
}

.node-term {
  font-size: 9px;
  fill: var(--text-secondary);
}

/* Node Warning States */
.course-node.warning-prereq .node-border {
  stroke: var(--danger);
  stroke-dasharray: 5 3;
}

.course-node.warning-conflict .node-border {
  stroke: var(--warning);
}

.node-warning-icon {
  font-size: 12px;
  cursor: help;
}

/* Connection Lines */
.connection-line {
  fill: none;
  stroke: #cbd5e1;
  stroke-width: 1.5;
  opacity: 0.4;
  marker-end: url(#arrowhead);
  transition: opacity 0.2s, stroke 0.2s;
}

.connection-line.highlighted-upstream {
  stroke: #3b82f6;
  stroke-width: 2;
  opacity: 1;
  marker-end: url(#arrowhead-blue);
}

.connection-line.highlighted-downstream {
  stroke: #22c55e;
  stroke-width: 2;
  opacity: 1;
  marker-end: url(#arrowhead-green);
}

.connection-line.faded {
  opacity: 0.15;
}
```

**Step 4: Add graph controls and stats styles**

Continue appending:

```css
/* Graph Controls */
.graph-controls {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface);
  padding: 0.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}

.graph-control-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--text);
  transition: background 0.2s;
}

.graph-control-btn:hover {
  background: var(--border);
}

.zoom-level {
  font-size: 0.75rem;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: center;
}

/* Graph Header Stats */
.graph-header-stats {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--surface);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.graph-stat {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.graph-stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.graph-stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.graph-major-progress {
  display: flex;
  gap: 1rem;
}

.graph-major-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.graph-major-name {
  font-size: 0.75rem;
  color: var(--text);
}

.graph-major-bar {
  width: 60px;
  height: 6px;
  background: var(--border);
  border-radius: 999px;
  overflow: hidden;
}

.graph-major-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 999px;
  transition: width 0.3s;
}

.graph-major-bar-fill.complete {
  background: var(--success);
}

/* Trash Dropzone */
.trash-dropzone {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--danger);
  color: white;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 100;
  transition: opacity 0.2s, transform 0.2s;
}

.trash-dropzone.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(20px);
}

.trash-dropzone.active {
  background: #b91c1c;
  transform: translateX(-50%) scale(1.05);
}
```

**Step 5: Add responsive styles for graph view**

Continue appending:

```css
/* Graph View Responsive */
@media (max-width: 1024px) {
  .graph-layout {
    grid-template-columns: 260px 1fr;
  }
}

@media (max-width: 768px) {
  .graph-layout {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
  }

  .graph-catalog {
    border-right: none;
    border-bottom: 1px solid var(--border);
    max-height: 40vh;
  }

  .graph-panel {
    height: 60vh;
  }

  .graph-header-stats {
    top: auto;
    bottom: 4rem;
    right: 0.5rem;
    left: 0.5rem;
    justify-content: center;
  }

  .graph-controls {
    bottom: 0.5rem;
    right: 0.5rem;
  }

  .core-terms {
    grid-template-columns: 1fr;
  }
}
```

**Step 6: Verify styles**

Refresh browser, confirm:
- Graph view has visible layout structure
- Catalog panel on left, graph area on right
- Core summary bar visible at top of graph panel
- No visual glitches

---

## Task 3: Create pathway-graph.js with Graph Class Structure

**Files:**
- Create: `pathway-graph.js`

**Step 1: Create the file with class skeleton**

Create new file `pathway-graph.js`:

```javascript
// WEMBA Pathway Graph Builder
// Interactive SVG-based course planning visualization

// Graph configuration constants
const GRAPH_CONFIG = {
  nodeWidth: 170,
  nodeHeight: 70,
  nodeGap: 16,
  columnWidth: 220,
  columnGap: 40,
  headerHeight: 60,
  padding: 40,
  minZoom: 0.5,
  maxZoom: 2.0,
  zoomStep: 0.1
};

// Department colors (matching existing DEPARTMENTS in data.js)
const DEPT_COLORS = {
  FNCE: '#2563eb',
  MGMT: '#7c3aed',
  MKTG: '#db2777',
  OIDD: '#059669',
  ACCT: '#d97706',
  STAT: '#0891b2',
  LGST: '#4f46e5',
  HCMG: '#dc2626',
  REAL: '#65a30d',
  BEPP: '#ea580c',
  WHCP: '#6366f1'
};

/**
 * PathwayGraph - Main graph visualization class
 */
class PathwayGraph {
  constructor(svgElement, state) {
    this.svg = svgElement;
    this.state = state;
    this.connectionsLayer = svgElement.querySelector('#connections-layer');
    this.nodesLayer = svgElement.querySelector('#nodes-layer');
    this.dropzonesLayer = svgElement.querySelector('#dropzones-layer');

    // Graph state
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.selectedNode = null;
    this.isDragging = false;
    this.isPanning = false;

    // Node positions cache
    this.nodePositions = new Map();

    // Initialize
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Zoom controls
    document.getElementById('zoom-in-btn')?.addEventListener('click', () => this.zoomIn());
    document.getElementById('zoom-out-btn')?.addEventListener('click', () => this.zoomOut());
    document.getElementById('zoom-reset-btn')?.addEventListener('click', () => this.resetView());

    // Pan with mouse drag on SVG background
    this.svg.addEventListener('mousedown', (e) => this.handlePanStart(e));
    this.svg.addEventListener('mousemove', (e) => this.handlePanMove(e));
    this.svg.addEventListener('mouseup', () => this.handlePanEnd());
    this.svg.addEventListener('mouseleave', () => this.handlePanEnd());

    // Click to deselect
    this.svg.addEventListener('click', (e) => {
      if (e.target === this.svg || e.target.closest('#dropzones-layer')) {
        this.clearSelection();
      }
    });
  }

  // Zoom methods
  zoomIn() {
    this.setZoom(Math.min(this.zoom + GRAPH_CONFIG.zoomStep, GRAPH_CONFIG.maxZoom));
  }

  zoomOut() {
    this.setZoom(Math.max(this.zoom - GRAPH_CONFIG.zoomStep, GRAPH_CONFIG.minZoom));
  }

  setZoom(level) {
    this.zoom = level;
    this.updateTransform();
    document.getElementById('zoom-level').textContent = `${Math.round(level * 100)}%`;
  }

  resetView() {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
    document.getElementById('zoom-level').textContent = '100%';
  }

  updateTransform() {
    const transform = `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`;
    this.connectionsLayer.setAttribute('transform', transform);
    this.nodesLayer.setAttribute('transform', transform);
    this.dropzonesLayer.setAttribute('transform', transform);
  }

  // Pan methods
  handlePanStart(e) {
    if (e.target === this.svg || e.target.classList.contains('term-dropzone')) {
      this.isPanning = true;
      this.panStartX = e.clientX - this.panX;
      this.panStartY = e.clientY - this.panY;
      this.svg.classList.add('panning');
    }
  }

  handlePanMove(e) {
    if (this.isPanning) {
      this.panX = e.clientX - this.panStartX;
      this.panY = e.clientY - this.panStartY;
      this.updateTransform();
    }
  }

  handlePanEnd() {
    this.isPanning = false;
    this.svg.classList.remove('panning');
  }

  // Selection
  selectNode(courseCode) {
    this.clearSelection();
    this.selectedNode = courseCode;

    const nodeEl = this.nodesLayer.querySelector(`[data-course="${courseCode}"]`);
    if (nodeEl) {
      nodeEl.classList.add('selected');
    }

    this.highlightPrerequisiteChain(courseCode);
  }

  clearSelection() {
    if (this.selectedNode) {
      const nodeEl = this.nodesLayer.querySelector(`[data-course="${this.selectedNode}"]`);
      if (nodeEl) {
        nodeEl.classList.remove('selected');
      }
      this.selectedNode = null;
    }
    this.clearHighlights();
  }

  // Render methods (to be implemented in later tasks)
  render() {
    this.renderDropZones();
    this.renderNodes();
    this.renderConnections();
    this.updateStats();
  }

  renderDropZones() {
    // Implemented in Task 4
  }

  renderNodes() {
    // Implemented in Task 5
  }

  renderConnections() {
    // Implemented in Task 6
  }

  highlightPrerequisiteChain(courseCode) {
    // Implemented in Task 6
  }

  clearHighlights() {
    // Implemented in Task 6
  }

  updateStats() {
    // Implemented in Task 7
  }
}

/**
 * CourseCatalog - Left panel course list manager
 */
class CourseCatalog {
  constructor(containerElement, state, graph) {
    this.container = containerElement;
    this.state = state;
    this.graph = graph;
    this.draggedCourse = null;
  }

  render() {
    // Implemented in Task 8
  }

  setupDragListeners() {
    // Implemented in Task 9
  }
}

// Global graph instance (initialized when view is shown)
let pathwayGraph = null;
let courseCatalog = null;

/**
 * Initialize the graph builder view
 */
function initGraphBuilder() {
  const svg = document.getElementById('pathway-graph');
  const catalogContainer = document.getElementById('catalog-majors');

  if (!svg || !catalogContainer) return;

  pathwayGraph = new PathwayGraph(svg, state);
  courseCatalog = new CourseCatalog(catalogContainer, state, pathwayGraph);

  // Initial render
  renderGraphView();
}

/**
 * Render/refresh the entire graph view
 */
function renderGraphView() {
  if (!pathwayGraph || !courseCatalog) return;

  renderCoreSummary();
  courseCatalog.render();
  pathwayGraph.render();
}

/**
 * Render core curriculum summary bar
 */
function renderCoreSummary() {
  const cohort = state.selectedCohort;
  if (!cohort) return;

  const coreCurriculum = CORE_CURRICULUM[cohort];
  const cohortName = COHORTS[cohort].name;

  // Update collapsed summary
  document.getElementById('core-cohort-name').textContent = cohortName;

  // Calculate core CU
  let coreCU = 0;
  ['T1', 'T2', 'T3'].forEach(term => {
    (coreCurriculum[term] || []).forEach(c => {
      if (c.code === 'FNCE-6210' && state.financeChoice === 'FNCE-6110' && cohort !== 'global') {
        return; // Skip if chose FNCE-6110
      }
      coreCU += c.credits;
    });
  });
  if (cohort !== 'global' && state.financeChoice === 'FNCE-6110') {
    coreCU += 1.0; // Add FNCE-6110
  }

  document.getElementById('core-cu-total').textContent = `${coreCU.toFixed(1)} CU`;

  // Finance indicator
  const financeIndicator = document.getElementById('finance-indicator');
  if (cohort !== 'global' && state.financeChoice) {
    financeIndicator.textContent = `Finance: ${state.financeChoice.replace('-', ' ')}`;
    if (state.targetMajors.includes('finance') && state.financeChoice === 'FNCE-6210') {
      financeIndicator.classList.add('warning');
      financeIndicator.textContent += ' ⚠';
    } else {
      financeIndicator.classList.remove('warning');
    }
  } else if (cohort !== 'global') {
    financeIndicator.textContent = 'Finance: Not selected';
    financeIndicator.classList.add('warning');
  } else {
    financeIndicator.textContent = '';
  }

  // Render expanded terms
  ['T1', 'T2', 'T3'].forEach(term => {
    const termEl = document.getElementById(`core-${term}`);
    if (!termEl) return;

    let courses = [...(coreCurriculum[term] || [])];

    // Handle T3 finance choice
    if (term === 'T3' && cohort !== 'global') {
      if (state.financeChoice === 'FNCE-6110') {
        courses = courses.filter(c => c.code !== 'FNCE-6210');
        const altCourse = coreCurriculum.T3_alternative?.find(c => c.code === 'FNCE-6110');
        if (altCourse) courses.unshift(altCourse);
      }
    }

    termEl.innerHTML = `
      <h5>Term ${term.slice(1)}</h5>
      ${courses.map(c => `
        <div class="core-term-course">
          ${c.code.replace('-', ' ')}
          <span>${c.credits} CU</span>
        </div>
      `).join('')}
    `;
  });

  // Toggle expand/collapse
  document.getElementById('core-expand-btn')?.addEventListener('click', () => {
    document.getElementById('core-collapsed').classList.add('hidden');
    document.getElementById('core-expanded').classList.remove('hidden');
  });

  document.getElementById('core-collapse-btn')?.addEventListener('click', () => {
    document.getElementById('core-expanded').classList.add('hidden');
    document.getElementById('core-collapsed').classList.remove('hidden');
  });
}

// Export for use in app.js
window.initGraphBuilder = initGraphBuilder;
window.renderGraphView = renderGraphView;
```

**Step 2: Verify basic structure**

Refresh browser, open console:
- No syntax errors
- `initGraphBuilder` and `renderGraphView` are available on window

---

## Task 4: Implement Term Drop Zones Rendering

**Files:**
- Modify: `pathway-graph.js`

**Step 1: Implement renderDropZones method**

In `PathwayGraph` class, replace the `renderDropZones()` placeholder:

```javascript
renderDropZones() {
  this.dropzonesLayer.innerHTML = '';

  const terms = ['T4', 'T5', 'T6'];
  const cohort = this.state.selectedCohort;

  terms.forEach((term, index) => {
    const x = GRAPH_CONFIG.padding + index * (GRAPH_CONFIG.columnWidth + GRAPH_CONFIG.columnGap);
    const y = GRAPH_CONFIG.padding;
    const width = GRAPH_CONFIG.columnWidth;
    const height = this.calculateColumnHeight(term);

    // Get term schedule info
    const schedule = SCHEDULE[cohort]?.[term];
    const termLabel = schedule?.name || `Term ${term.slice(1)}`;

    // Column header
    const header = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    header.setAttribute('x', x + width / 2);
    header.setAttribute('y', y - 25);
    header.setAttribute('text-anchor', 'middle');
    header.setAttribute('class', 'term-column-header');
    header.textContent = term;
    this.dropzonesLayer.appendChild(header);

    // Subheader (season/dates)
    const subheader = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    subheader.setAttribute('x', x + width / 2);
    subheader.setAttribute('y', y - 10);
    subheader.setAttribute('text-anchor', 'middle');
    subheader.setAttribute('class', 'term-column-subheader');
    subheader.textContent = termLabel;
    this.dropzonesLayer.appendChild(subheader);

    // Drop zone rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('class', 'term-dropzone');
    rect.setAttribute('data-term', term);
    this.dropzonesLayer.appendChild(rect);

    // CU total for this term
    const coursesInTerm = this.getCoursesInTerm(term);
    const termCU = coursesInTerm.reduce((sum, c) => sum + (COURSES[c]?.credits || 0), 0);

    const cuLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    cuLabel.setAttribute('x', x + width / 2);
    cuLabel.setAttribute('y', y + height + 20);
    cuLabel.setAttribute('text-anchor', 'middle');
    cuLabel.setAttribute('class', 'term-column-subheader');
    cuLabel.textContent = `${termCU.toFixed(1)} CU`;
    this.dropzonesLayer.appendChild(cuLabel);
  });
}

calculateColumnHeight(term) {
  const coursesInTerm = this.getCoursesInTerm(term);
  const minHeight = 300;
  const calculatedHeight = GRAPH_CONFIG.headerHeight +
    coursesInTerm.length * (GRAPH_CONFIG.nodeHeight + GRAPH_CONFIG.nodeGap) +
    GRAPH_CONFIG.padding;
  return Math.max(minHeight, calculatedHeight);
}

getCoursesInTerm(term) {
  const cohort = this.state.selectedCohort;
  return this.state.plannedCourses.filter(code => {
    const normalizedCode = code.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (!course) return false;
    const offering = course.offerings?.[cohort];
    return offering?.term === term;
  });
}
```

**Step 2: Verify drop zones render**

Refresh browser, switch to Graph Builder tab:
- Three columns visible (T4, T5, T6)
- Headers show term names
- CU totals display at bottom

---

## Task 5: Implement Course Node Rendering

**Files:**
- Modify: `pathway-graph.js`

**Step 1: Implement renderNodes method**

In `PathwayGraph` class, replace `renderNodes()` placeholder:

```javascript
renderNodes() {
  this.nodesLayer.innerHTML = '';
  this.nodePositions.clear();

  const terms = ['T4', 'T5', 'T6'];
  const cohort = this.state.selectedCohort;

  terms.forEach((term, termIndex) => {
    const columnX = GRAPH_CONFIG.padding + termIndex * (GRAPH_CONFIG.columnWidth + GRAPH_CONFIG.columnGap);
    const coursesInTerm = this.getCoursesInTerm(term);

    coursesInTerm.forEach((courseCode, courseIndex) => {
      const normalizedCode = courseCode.replace(/\s+/g, '-');
      const course = COURSES[normalizedCode];
      if (!course) return;

      const x = columnX + (GRAPH_CONFIG.columnWidth - GRAPH_CONFIG.nodeWidth) / 2;
      const y = GRAPH_CONFIG.padding + GRAPH_CONFIG.headerHeight +
                courseIndex * (GRAPH_CONFIG.nodeHeight + GRAPH_CONFIG.nodeGap);

      // Store position for connection lines
      this.nodePositions.set(normalizedCode, {
        x: x + GRAPH_CONFIG.nodeWidth / 2,
        y: y + GRAPH_CONFIG.nodeHeight / 2,
        left: x,
        right: x + GRAPH_CONFIG.nodeWidth,
        top: y,
        bottom: y + GRAPH_CONFIG.nodeHeight
      });

      // Create node group
      const nodeGroup = this.createCourseNode(normalizedCode, course, x, y);
      this.nodesLayer.appendChild(nodeGroup);
    });
  });
}

createCourseNode(courseCode, course, x, y) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'course-node');
  g.setAttribute('data-course', courseCode);
  g.setAttribute('transform', `translate(${x}, ${y})`);

  const width = GRAPH_CONFIG.nodeWidth;
  const height = GRAPH_CONFIG.nodeHeight;
  const deptColor = DEPT_COLORS[course.department] || '#64748b';

  // Check validation state
  const validationState = this.getNodeValidationState(courseCode);
  if (validationState.includes('prereq')) {
    g.classList.add('warning-prereq');
  }
  if (validationState.includes('conflict')) {
    g.classList.add('warning-conflict');
  }

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('class', 'node-bg');
  bg.setAttribute('width', width);
  bg.setAttribute('height', height);
  g.appendChild(bg);

  // Selection border
  const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  border.setAttribute('class', 'node-border');
  border.setAttribute('width', width);
  border.setAttribute('height', height);
  g.appendChild(border);

  // Department color bar
  const deptBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  deptBar.setAttribute('class', 'node-dept-bar');
  deptBar.setAttribute('width', width);
  deptBar.setAttribute('height', 6);
  deptBar.setAttribute('fill', deptColor);
  g.appendChild(deptBar);

  // Course code
  const codeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  codeText.setAttribute('class', 'node-code');
  codeText.setAttribute('x', 10);
  codeText.setAttribute('y', 24);
  codeText.textContent = course.code.replace('-', ' ');
  g.appendChild(codeText);

  // Course title (truncated)
  const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  titleText.setAttribute('class', 'node-title');
  titleText.setAttribute('x', 10);
  titleText.setAttribute('y', 40);
  const maxTitleLength = 22;
  const truncatedTitle = course.title.length > maxTitleLength
    ? course.title.substring(0, maxTitleLength) + '...'
    : course.title;
  titleText.textContent = truncatedTitle;
  g.appendChild(titleText);

  // Credits badge
  const creditsText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  creditsText.setAttribute('class', 'node-credits');
  creditsText.setAttribute('x', 10);
  creditsText.setAttribute('y', 58);
  creditsText.textContent = `${course.credits} CU`;
  g.appendChild(creditsText);

  // Term badge
  const cohort = this.state.selectedCohort;
  const offering = course.offerings?.[cohort];
  const termText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  termText.setAttribute('class', 'node-term');
  termText.setAttribute('x', width - 10);
  termText.setAttribute('y', 58);
  termText.setAttribute('text-anchor', 'end');
  termText.textContent = offering?.term || '';
  g.appendChild(termText);

  // Warning icon if needed
  if (validationState.length > 0) {
    const warningIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    warningIcon.setAttribute('class', 'node-warning-icon');
    warningIcon.setAttribute('x', width - 10);
    warningIcon.setAttribute('y', 22);
    warningIcon.setAttribute('text-anchor', 'end');
    warningIcon.textContent = validationState.includes('prereq') ? '⚠' : '⚡';
    warningIcon.setAttribute('fill', validationState.includes('prereq') ? '#dc2626' : '#d97706');

    // Tooltip
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = this.getValidationTooltip(courseCode, validationState);
    warningIcon.appendChild(title);

    g.appendChild(warningIcon);
  }

  // Event listeners
  g.addEventListener('click', (e) => {
    e.stopPropagation();
    this.selectNode(courseCode);
  });

  g.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    showCourseDetails(courseCode);
  });

  // Make draggable within graph
  this.makeNodeDraggable(g, courseCode);

  return g;
}

getNodeValidationState(courseCode) {
  const states = [];

  // Check prerequisites
  const prereqWarnings = getMissingPrerequisites();
  if (prereqWarnings.some(w => w.course === courseCode.replace('-', ' '))) {
    states.push('prereq');
  }

  // Check schedule conflicts
  const conflicts = getScheduleConflicts();
  const normalizedCode = courseCode.replace('-', ' ');
  if (conflicts.some(c => c.course1 === normalizedCode || c.course2 === normalizedCode)) {
    states.push('conflict');
  }

  return states;
}

getValidationTooltip(courseCode, states) {
  const messages = [];

  if (states.includes('prereq')) {
    const prereqWarnings = getMissingPrerequisites();
    const warning = prereqWarnings.find(w => w.course === courseCode.replace('-', ' '));
    if (warning) {
      messages.push(`Missing prerequisites: ${warning.missing.join(', ')}`);
    }
  }

  if (states.includes('conflict')) {
    const conflicts = getScheduleConflicts();
    const normalizedCode = courseCode.replace('-', ' ');
    const relevantConflicts = conflicts.filter(c =>
      c.course1 === normalizedCode || c.course2 === normalizedCode
    );
    relevantConflicts.forEach(c => {
      const otherCourse = c.course1 === normalizedCode ? c.course2 : c.course1;
      messages.push(`Schedule conflict with ${otherCourse}`);
    });
  }

  return messages.join('\n');
}

makeNodeDraggable(nodeElement, courseCode) {
  let isDragging = false;
  let startX, startY;
  let originalTransform;

  nodeElement.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only left click

    isDragging = true;
    const transform = nodeElement.getAttribute('transform');
    const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    startX = e.clientX;
    startY = e.clientY;
    originalTransform = transform;

    nodeElement.classList.add('dragging');
    document.getElementById('trash-dropzone')?.classList.remove('hidden');

    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = (e.clientX - startX) / this.zoom;
    const dy = (e.clientY - startY) / this.zoom;

    const match = originalTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    if (match) {
      const newX = parseFloat(match[1]) + dx;
      const newY = parseFloat(match[2]) + dy;
      nodeElement.setAttribute('transform', `translate(${newX}, ${newY})`);
    }

    // Highlight drop zones
    this.highlightDropZone(e.clientX, e.clientY, courseCode);
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;

    nodeElement.classList.remove('dragging');
    document.getElementById('trash-dropzone')?.classList.add('hidden');
    this.clearDropZoneHighlights();

    // Check if dropped on trash
    const trashZone = document.getElementById('trash-dropzone');
    if (trashZone && this.isOverElement(e.clientX, e.clientY, trashZone)) {
      removeCourse(courseCode);
      return;
    }

    // Check if dropped on a valid term column
    const targetTerm = this.getDropTargetTerm(e.clientX, e.clientY, courseCode);
    if (targetTerm) {
      this.moveCourseToTerm(courseCode, targetTerm);
    } else {
      // Snap back
      nodeElement.setAttribute('transform', originalTransform);
    }
  });
}

highlightDropZone(clientX, clientY, courseCode) {
  this.clearDropZoneHighlights();

  const course = COURSES[courseCode.replace(/\s+/g, '-')];
  if (!course) return;

  const cohort = this.state.selectedCohort;
  const dropzones = this.dropzonesLayer.querySelectorAll('.term-dropzone');

  dropzones.forEach(zone => {
    const rect = this.getSvgElementBounds(zone);
    if (this.isPointInRect(clientX, clientY, rect)) {
      const term = zone.getAttribute('data-term');
      const offering = course.offerings?.[cohort];

      if (offering?.term === term) {
        zone.classList.add('active');
      } else {
        zone.classList.add('invalid');
      }
    }
  });

  // Check trash zone
  const trashZone = document.getElementById('trash-dropzone');
  if (trashZone && this.isOverElement(clientX, clientY, trashZone)) {
    trashZone.classList.add('active');
  } else {
    trashZone?.classList.remove('active');
  }
}

clearDropZoneHighlights() {
  this.dropzonesLayer.querySelectorAll('.term-dropzone').forEach(zone => {
    zone.classList.remove('active', 'invalid');
  });
}

getSvgElementBounds(element) {
  const svgRect = this.svg.getBoundingClientRect();
  const bbox = element.getBBox();

  // Apply current transform
  const x = svgRect.left + (bbox.x * this.zoom) + this.panX;
  const y = svgRect.top + (bbox.y * this.zoom) + this.panY;
  const width = bbox.width * this.zoom;
  const height = bbox.height * this.zoom;

  return { x, y, width, height };
}

isPointInRect(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.width &&
         py >= rect.y && py <= rect.y + rect.height;
}

isOverElement(clientX, clientY, element) {
  const rect = element.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right &&
         clientY >= rect.top && clientY <= rect.bottom;
}

getDropTargetTerm(clientX, clientY, courseCode) {
  const course = COURSES[courseCode.replace(/\s+/g, '-')];
  if (!course) return null;

  const cohort = this.state.selectedCohort;
  const offering = course.offerings?.[cohort];
  if (!offering) return null;

  const dropzones = this.dropzonesLayer.querySelectorAll('.term-dropzone');

  for (const zone of dropzones) {
    const rect = this.getSvgElementBounds(zone);
    if (this.isPointInRect(clientX, clientY, rect)) {
      const term = zone.getAttribute('data-term');
      // Only allow drop if course is offered in this term
      if (offering.term === term) {
        return term;
      }
    }
  }

  return null;
}

moveCourseToTerm(courseCode, term) {
  // Course can only exist in its offered term, so this is really just a re-render
  // The validation still applies based on offering
  renderGraphView();
}
```

**Step 2: Verify nodes render**

Add some courses to plan via Explorer, switch to Graph Builder:
- Course nodes appear in correct term columns
- Department color bars visible
- Course code and title displayed
- Warning icons appear for validation issues

---

## Task 6: Implement Prerequisite Connection Lines

**Files:**
- Modify: `pathway-graph.js`

**Step 1: Implement connection rendering**

In `PathwayGraph` class, replace `renderConnections()` and related methods:

```javascript
renderConnections() {
  this.connectionsLayer.innerHTML = '';

  const cohort = this.state.selectedCohort;
  const plannedCodes = new Set(this.state.plannedCourses.map(c => c.replace(/\s+/g, '-')));

  // Add core curriculum to planned set for connection purposes
  const coreCurriculum = CORE_CURRICULUM[cohort];
  ['T1', 'T2', 'T3'].forEach(term => {
    (coreCurriculum[term] || []).forEach(c => {
      plannedCodes.add(c.code);
    });
  });

  // Handle finance choice
  if (cohort !== 'global') {
    if (this.state.financeChoice === 'FNCE-6110') {
      plannedCodes.add('FNCE-6110');
    } else {
      plannedCodes.add('FNCE-6210');
    }
  } else {
    plannedCodes.add('FNCE-6110');
  }

  // For each planned elective course, draw connections to its prerequisites
  this.state.plannedCourses.forEach(code => {
    const normalizedCode = code.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (!course?.prerequisites) return;

    const toPos = this.nodePositions.get(normalizedCode);
    if (!toPos) return;

    course.prerequisites.forEach(prereqCode => {
      // Only draw if prereq is in plan
      if (!plannedCodes.has(prereqCode)) return;

      const fromPos = this.nodePositions.get(prereqCode);
      if (!fromPos) {
        // Prereq might be in core curriculum (not rendered as node)
        // Draw from left edge
        this.drawConnectionFromCore(prereqCode, toPos, normalizedCode);
      } else {
        this.drawConnection(fromPos, toPos, prereqCode, normalizedCode);
      }
    });
  });
}

drawConnection(fromPos, toPos, fromCode, toCode) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  // Calculate bezier curve
  const startX = fromPos.right;
  const startY = fromPos.y;
  const endX = toPos.left;
  const endY = toPos.y;

  const controlOffset = Math.min(80, Math.abs(endX - startX) / 2);

  const d = `M ${startX} ${startY}
             C ${startX + controlOffset} ${startY},
               ${endX - controlOffset} ${endY},
               ${endX} ${endY}`;

  path.setAttribute('d', d);
  path.setAttribute('class', 'connection-line');
  path.setAttribute('data-from', fromCode);
  path.setAttribute('data-to', toCode);

  this.connectionsLayer.appendChild(path);
}

drawConnectionFromCore(prereqCode, toPos, toCode) {
  // For prerequisites in core curriculum, draw from left side of graph
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  const startX = 0;
  const startY = toPos.y;
  const endX = toPos.left;
  const endY = toPos.y;

  const d = `M ${startX} ${startY}
             C ${startX + 40} ${startY},
               ${endX - 40} ${endY},
               ${endX} ${endY}`;

  path.setAttribute('d', d);
  path.setAttribute('class', 'connection-line');
  path.setAttribute('data-from', prereqCode);
  path.setAttribute('data-to', toCode);
  path.style.strokeDasharray = '4 4'; // Dashed for core prereqs

  this.connectionsLayer.appendChild(path);
}

highlightPrerequisiteChain(courseCode) {
  const normalizedCode = courseCode.replace(/\s+/g, '-');

  // Get upstream (prerequisites) and downstream (dependents)
  const upstream = this.getUpstreamCourses(normalizedCode);
  const downstream = this.getDownstreamCourses(normalizedCode);

  // Fade all connections and nodes first
  this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
    line.classList.add('faded');
    line.classList.remove('highlighted-upstream', 'highlighted-downstream');
  });

  this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
    if (node.getAttribute('data-course') !== normalizedCode) {
      node.style.opacity = '0.4';
    }
  });

  // Highlight upstream
  upstream.forEach(code => {
    const nodeEl = this.nodesLayer.querySelector(`[data-course="${code}"]`);
    if (nodeEl) nodeEl.style.opacity = '1';

    // Highlight connection to this course
    const line = this.connectionsLayer.querySelector(
      `[data-to="${normalizedCode}"][data-from="${code}"], [data-to="${code}"]`
    );
    if (line) {
      line.classList.remove('faded');
      line.classList.add('highlighted-upstream');
    }
  });

  // Highlight all connections leading to selected node
  this.connectionsLayer.querySelectorAll(`[data-to="${normalizedCode}"]`).forEach(line => {
    line.classList.remove('faded');
    line.classList.add('highlighted-upstream');
  });

  // Highlight downstream
  downstream.forEach(code => {
    const nodeEl = this.nodesLayer.querySelector(`[data-course="${code}"]`);
    if (nodeEl) nodeEl.style.opacity = '1';
  });

  // Highlight all connections from selected node
  this.connectionsLayer.querySelectorAll(`[data-from="${normalizedCode}"]`).forEach(line => {
    line.classList.remove('faded');
    line.classList.add('highlighted-downstream');
  });
}

clearHighlights() {
  this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
    line.classList.remove('faded', 'highlighted-upstream', 'highlighted-downstream');
  });

  this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
    node.style.opacity = '1';
  });
}

getUpstreamCourses(courseCode) {
  const upstream = new Set();
  const visited = new Set();

  const traverse = (code) => {
    if (visited.has(code)) return;
    visited.add(code);

    const course = COURSES[code];
    if (!course?.prerequisites) return;

    course.prerequisites.forEach(prereqCode => {
      upstream.add(prereqCode);
      traverse(prereqCode);
    });
  };

  traverse(courseCode);
  return upstream;
}

getDownstreamCourses(courseCode) {
  const downstream = new Set();

  // Check all planned courses to see if they depend on this course
  this.state.plannedCourses.forEach(code => {
    const normalizedCode = code.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (!course?.prerequisites) return;

    if (course.prerequisites.includes(courseCode)) {
      downstream.add(normalizedCode);
    }
  });

  return downstream;
}
```

**Step 2: Verify connections**

Add courses with prerequisites to plan:
- Lines connect prerequisite courses to dependent courses
- Click a node to see upstream (blue) and downstream (green) highlighted
- Unrelated nodes fade

---

## Task 7: Implement Stats Update

**Files:**
- Modify: `pathway-graph.js`

**Step 1: Implement updateStats method**

In `PathwayGraph` class, replace `updateStats()`:

```javascript
updateStats() {
  // Update total CU
  const totalCU = calculateTotalCU();
  document.getElementById('graph-total-cu').textContent = totalCU.toFixed(1);

  // Update major progress bars
  const majorProgressContainer = document.getElementById('graph-major-progress');
  if (!majorProgressContainer) return;

  if (this.state.targetMajors.length === 0) {
    majorProgressContainer.innerHTML = '<span style="font-size: 0.75rem; color: var(--text-secondary);">No majors selected</span>';
    return;
  }

  majorProgressContainer.innerHTML = this.state.targetMajors.map(majorId => {
    const major = MAJORS[majorId];
    const progress = calculateMajorProgress(majorId);
    const percent = Math.min((progress.completed / major.requiredCUs) * 100, 100);
    const isComplete = percent >= 100;

    return `
      <div class="graph-major-item">
        <span class="graph-major-name">${major.name}</span>
        <div class="graph-major-bar">
          <div class="graph-major-bar-fill ${isComplete ? 'complete' : ''}"
               style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }).join('');
}
```

**Step 2: Verify stats display**

- Total CU updates when courses are added/removed
- Major progress bars show completion percentage
- Complete majors show green bar

---

## Task 8: Implement Course Catalog Rendering

**Files:**
- Modify: `pathway-graph.js`

**Step 1: Implement CourseCatalog render method**

In `CourseCatalog` class, replace the `render()` placeholder:

```javascript
render() {
  const emptyState = document.getElementById('catalog-empty');

  if (this.state.targetMajors.length === 0) {
    this.container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  const cohort = this.state.selectedCohort;
  const plannedSet = new Set(this.state.plannedCourses.map(c => c.replace(/\s+/g, '-')));

  // Get courses in plan including core curriculum for prereq checking
  const allPlannedCourses = new Set(plannedSet);
  const coreCurriculum = CORE_CURRICULUM[cohort];
  ['T1', 'T2', 'T3'].forEach(term => {
    (coreCurriculum[term] || []).forEach(c => allPlannedCourses.add(c.code));
  });
  if (this.state.financeChoice === 'FNCE-6110') {
    allPlannedCourses.add('FNCE-6110');
  }

  let html = '';

  this.state.targetMajors.forEach(majorId => {
    const major = MAJORS[majorId];
    const allMajorCourses = [
      ...(major.electiveCourses || []),
      ...(major.primaryCourses || []),
      ...(major.secondaryCourses || [])
    ];

    // Filter to courses available for this cohort
    const availableCourses = allMajorCourses
      .map(code => ({ code, course: COURSES[code] }))
      .filter(({ course }) => course?.offerings?.[cohort])
      .map(({ code, course }) => {
        const inPlan = plannedSet.has(code);
        const prereqsMet = this.arePrereqsMet(code, allPlannedCourses);
        const offering = course.offerings[cohort];
        return { code, course, inPlan, prereqsMet, offering };
      });

    if (availableCourses.length === 0) return;

    const inPlanCount = availableCourses.filter(c => c.inPlan).length;

    html += `
      <div class="catalog-major" data-major="${majorId}">
        <div class="catalog-major-header" onclick="toggleCatalogMajor('${majorId}')">
          <h4>${major.name}</h4>
          <span class="badge">${inPlanCount}/${availableCourses.length}</span>
          <span class="chevron">▼</span>
        </div>
        <div class="catalog-courses">
          ${availableCourses.map(c => this.renderCatalogCourse(c)).join('')}
        </div>
      </div>
    `;
  });

  this.container.innerHTML = html;
  this.setupDragListeners();
}

renderCatalogCourse({ code, course, inPlan, prereqsMet, offering }) {
  const deptColor = DEPT_COLORS[course.department] || '#64748b';
  const isLocked = !prereqsMet && !inPlan;

  let statusHtml = '';
  if (inPlan) {
    statusHtml = '<span class="catalog-course-status added">✓ Added</span>';
  } else if (isLocked) {
    statusHtml = '<span class="catalog-course-status locked">🔒 Prereqs</span>';
  }

  return `
    <div class="catalog-course ${inPlan ? 'in-plan' : ''} ${isLocked ? 'locked' : ''}"
         data-course="${code}"
         draggable="${!inPlan && !isLocked}">
      <div class="catalog-course-color" style="background: ${deptColor}"></div>
      <div class="catalog-course-info">
        <div class="catalog-course-code">${course.code.replace('-', ' ')}</div>
        <div class="catalog-course-title">${course.title}</div>
      </div>
      <div class="catalog-course-meta">
        <span class="catalog-course-credits">${course.credits} CU</span>
        <span class="catalog-course-term">${offering.term}</span>
        ${statusHtml}
      </div>
    </div>
  `;
}

arePrereqsMet(courseCode, plannedCourses) {
  const course = COURSES[courseCode];
  if (!course?.prerequisites || course.prerequisites.length === 0) return true;
  return course.prerequisites.every(prereq => plannedCourses.has(prereq));
}
```

**Step 2: Add toggle function to global scope**

Add at end of `pathway-graph.js`:

```javascript
// Toggle catalog major section collapse
function toggleCatalogMajor(majorId) {
  const section = document.querySelector(`.catalog-major[data-major="${majorId}"]`);
  if (section) {
    section.classList.toggle('collapsed');
  }
}

window.toggleCatalogMajor = toggleCatalogMajor;
```

**Step 3: Verify catalog renders**

Select target majors in Explorer, switch to Graph Builder:
- Major sections appear with course counts
- Courses show code, title, credits, term
- In-plan courses show checkmark
- Locked courses show lock icon

---

## Task 9: Implement Drag-and-Drop from Catalog

**Files:**
- Modify: `pathway-graph.js`

**Step 1: Implement drag listeners for catalog**

In `CourseCatalog` class, replace `setupDragListeners()`:

```javascript
setupDragListeners() {
  const catalogCourses = this.container.querySelectorAll('.catalog-course[draggable="true"]');

  catalogCourses.forEach(courseEl => {
    courseEl.addEventListener('dragstart', (e) => {
      const courseCode = courseEl.getAttribute('data-course');
      this.draggedCourse = courseCode;
      courseEl.classList.add('dragging');

      e.dataTransfer.setData('text/plain', courseCode);
      e.dataTransfer.effectAllowed = 'copy';

      // Show trash zone
      document.getElementById('trash-dropzone')?.classList.remove('hidden');

      // Highlight valid drop zones
      this.graph.showDropZonesForCourse(courseCode);
    });

    courseEl.addEventListener('dragend', () => {
      courseEl.classList.remove('dragging');
      this.draggedCourse = null;

      document.getElementById('trash-dropzone')?.classList.add('hidden');
      this.graph.clearDropZoneHighlights();
    });
  });
}
```

**Step 2: Add drop zone methods to PathwayGraph**

Add to `PathwayGraph` class:

```javascript
showDropZonesForCourse(courseCode) {
  const course = COURSES[courseCode.replace(/\s+/g, '-')];
  if (!course) return;

  const cohort = this.state.selectedCohort;
  const offering = course.offerings?.[cohort];
  if (!offering) return;

  const dropzones = this.dropzonesLayer.querySelectorAll('.term-dropzone');
  dropzones.forEach(zone => {
    const term = zone.getAttribute('data-term');
    if (term === offering.term) {
      zone.classList.add('active');
    } else {
      zone.classList.add('invalid');
    }
  });
}

setupDropZoneListeners() {
  const container = document.getElementById('graph-canvas-container');
  if (!container) return;

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();

    const courseCode = e.dataTransfer.getData('text/plain');
    if (!courseCode) return;

    const course = COURSES[courseCode.replace(/\s+/g, '-')];
    if (!course) return;

    const cohort = this.state.selectedCohort;
    const offering = course.offerings?.[cohort];
    if (!offering) return;

    // Check if dropped on valid term
    const targetTerm = this.getDropTargetTerm(e.clientX, e.clientY, courseCode);

    if (targetTerm && targetTerm === offering.term) {
      addCourse(courseCode);
    }

    this.clearDropZoneHighlights();
  });
}
```

**Step 3: Call setupDropZoneListeners in constructor**

In `PathwayGraph` constructor, add at end:

```javascript
this.setupDropZoneListeners();
```

**Step 4: Verify drag-and-drop**

- Drag a course from catalog
- Valid drop zone highlights green
- Invalid zones highlight red
- Dropping on valid zone adds course to plan
- Graph re-renders with new course

---

## Task 10: Integrate with app.js Navigation

**Files:**
- Modify: `app.js`

**Step 1: Update switchView function**

Find `switchView` function (around line 125) and add graph view handling:

```javascript
function switchView(viewName) {
  state.currentView = viewName;

  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === viewName);
  });

  // Update views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(`${viewName}-view`).classList.add('active');

  // Refresh view content
  if (viewName === 'pathway') {
    updatePathway();
  } else if (viewName === 'dashboard') {
    updateDashboard();
  } else if (viewName === 'graph') {
    // Initialize graph builder if needed
    if (typeof initGraphBuilder === 'function') {
      initGraphBuilder();
    }
  }
}
```

**Step 2: Update render functions to also update graph**

At end of `addCourse` function (around line 636), add:

```javascript
// Also refresh graph view if initialized
if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
  renderGraphView();
}
```

At end of `removeCourse` function (around line 654), add:

```javascript
// Also refresh graph view if initialized
if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
  renderGraphView();
}
```

At end of `toggleTargetMajor` function (around line 668), add:

```javascript
// Refresh graph catalog if on graph view
if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
  renderGraphView();
}
```

At end of `setFinanceChoice` function (around line 116), add:

```javascript
// Refresh graph if on graph view
if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
  renderGraphView();
}
```

**Step 3: Verify integration**

- Clicking "Graph Builder" tab shows graph view
- Adding/removing courses updates graph
- Changing target majors updates catalog
- Finance choice updates core summary

---

## Task 11: Final Testing and Polish

**Step 1: Test complete workflow**

1. Select Philadelphia cohort
2. Go to Explorer, select Finance and Marketing as target majors
3. Add a few elective courses
4. Switch to Graph Builder
5. Verify:
   - Catalog shows Finance and Marketing courses
   - Added courses show in graph
   - Connection lines visible for prerequisites
   - Click node to see highlighted chain
   - Drag course from catalog to add
   - Drag node to trash to remove
   - CU total updates correctly
   - Major progress bars update

**Step 2: Test validation states**

1. Add a course with missing prerequisites
2. Verify warning icon appears on node
3. Hover to see tooltip with missing prereqs

**Step 3: Test zoom and pan**

1. Use zoom buttons to zoom in/out
2. Drag on background to pan
3. Reset button returns to default view

**Step 4: Test responsive behavior**

1. Resize browser to tablet width
2. Verify catalog and graph stack properly
3. All functionality still works

---

## Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | index.html | Add graph view HTML structure |
| 2 | styles.css | Add comprehensive graph styles |
| 3 | pathway-graph.js | Create class skeleton and core logic |
| 4 | pathway-graph.js | Implement term drop zones |
| 5 | pathway-graph.js | Implement course nodes |
| 6 | pathway-graph.js | Implement prerequisite lines |
| 7 | pathway-graph.js | Implement stats update |
| 8 | pathway-graph.js | Implement catalog rendering |
| 9 | pathway-graph.js | Implement drag-and-drop |
| 10 | app.js | Integrate with navigation |
| 11 | Manual | Final testing |

**Total new code:** ~800 lines (pathway-graph.js) + ~300 lines (styles.css) + ~100 lines (index.html) + ~20 lines (app.js modifications)
