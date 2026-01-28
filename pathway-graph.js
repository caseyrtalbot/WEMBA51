// WEMBA Pathway Graph Builder
// Interactive SVG-based course planning visualization

// Graph configuration constants
const GRAPH_CONFIG = {
  nodeWidth: 170,
  nodeHeight: 70,
  nodeBadgeHeight: 18, // Space for prereq status badge below node
  nodeGap: 20, // Increased to accommodate badges
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
    this.showConflictsMode = false;
    this.majorDisplayMode = 'all'; // 'all', 'highlight', 'filter'

    // Node positions cache
    this.nodePositions = new Map();

    // Initialize
    this.setupEventListeners();
    this.setupDropZoneListeners();
    this.setupConflictToggle();
    this.setupMajorModeSelector();
    this.setupInteractiveLegend();
    this.setupMajorsDisplay();
  }

  setupConflictToggle() {
    const conflictBtn = document.getElementById('show-conflicts-btn');
    if (conflictBtn) {
      conflictBtn.addEventListener('click', () => this.toggleConflictsMode());
    }
  }

  setupMajorModeSelector() {
    const modeSelector = document.getElementById('major-mode-selector');
    if (!modeSelector) return;

    modeSelector.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        this.setMajorDisplayMode(mode);

        // Update button states
        modeSelector.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  setupMajorsDisplay() {
    const clearBtn = document.getElementById('clear-majors-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAllMajors());
    }
  }

  updateMajorsDisplay() {
    const container = document.getElementById('graph-majors-display');
    const tagsContainer = document.getElementById('selected-majors-tags');
    const modeSelector = document.getElementById('major-mode-selector');

    if (!container || !tagsContainer) return;

    const hasMajors = this.state.targetMajors.length > 0;

    if (!hasMajors) {
      container.classList.add('hidden');
      // Disable highlight/filter buttons when no majors
      if (modeSelector) {
        modeSelector.querySelectorAll('.mode-btn').forEach(btn => {
          const mode = btn.getAttribute('data-mode');
          if (mode !== 'all') {
            btn.disabled = true;
            btn.title = 'Select a target major in Explorer first';
          }
        });
      }
      return;
    }

    container.classList.remove('hidden');

    // Enable all mode buttons when majors exist
    if (modeSelector) {
      modeSelector.querySelectorAll('.mode-btn').forEach(btn => {
        btn.disabled = false;
        const mode = btn.getAttribute('data-mode');
        btn.title = mode === 'all' ? 'Show All Courses' :
                   mode === 'highlight' ? 'Highlight Major Courses' : 'Filter to Major Courses';
      });
    }

    tagsContainer.innerHTML = this.state.targetMajors.map(majorId => {
      const major = MAJORS[majorId];
      if (!major) return '';
      const shortName = major.name.length > 12 ? major.name.substring(0, 10) + '...' : major.name;
      return `
        <span class="major-tag" data-major="${majorId}" title="${major.name}">
          ${shortName}
          <span class="remove-major" onclick="pathwayGraph.removeMajor('${majorId}')">&times;</span>
        </span>
      `;
    }).join('');
  }

  removeMajor(majorId) {
    // Remove from state
    this.state.targetMajors = this.state.targetMajors.filter(m => m !== majorId);
    saveState();

    // Update displays
    this.updateMajorsDisplay();
    this.render();

    // Update dashboard if function exists
    if (typeof updateDashboard === 'function') {
      updateDashboard();
    }
  }

  clearAllMajors() {
    if (this.state.targetMajors.length === 0) return;

    // Clear all majors
    this.state.targetMajors = [];
    saveState();

    // Reset mode to 'all' since there's nothing to highlight/filter
    this.majorDisplayMode = 'all';
    const modeSelector = document.getElementById('major-mode-selector');
    if (modeSelector) {
      modeSelector.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === 'all');
      });
    }

    // Update displays
    this.updateMajorsDisplay();
    this.render();

    // Update dashboard if function exists
    if (typeof updateDashboard === 'function') {
      updateDashboard();
    }
  }

  setMajorDisplayMode(mode) {
    this.majorDisplayMode = mode;
    this.applyMajorDisplayMode();
  }

  applyMajorDisplayMode() {
    // Get courses that are relevant to target majors
    const majorRelevantCourses = this.getMajorRelevantCourses();

    this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
      const code = node.getAttribute('data-course');
      const isRelevant = majorRelevantCourses.has(code);

      // Remove all major-related classes first
      node.classList.remove('major-relevant', 'major-dimmed', 'major-hidden');
      node.style.removeProperty('--major-highlight-color');

      if (this.state.targetMajors.length === 0) {
        // No majors selected - show all normally
        return;
      }

      switch (this.majorDisplayMode) {
        case 'all':
          // Show all courses normally (no special highlighting)
          break;

        case 'highlight':
          if (isRelevant) {
            node.classList.add('major-relevant');
            // Set highlight color based on first matching major's department
            const highlightColor = this.getMajorHighlightColor(code);
            if (highlightColor) {
              node.style.setProperty('--major-highlight-color', highlightColor);
            }
          }
          break;

        case 'filter':
          if (!isRelevant) {
            node.classList.add('major-hidden');
          } else {
            node.classList.add('major-relevant');
          }
          break;
      }
    });

    // Also update connections visibility in filter mode
    if (this.majorDisplayMode === 'filter' && this.state.targetMajors.length > 0) {
      this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
        const fromCode = line.getAttribute('data-from');
        const toCode = line.getAttribute('data-to');
        const fromRelevant = majorRelevantCourses.has(fromCode);
        const toRelevant = majorRelevantCourses.has(toCode);

        if (!fromRelevant && !toRelevant) {
          line.style.display = 'none';
        } else {
          line.style.display = '';
        }
      });
    } else {
      this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
        line.style.display = '';
      });
    }
  }

  getMajorRelevantCourses() {
    const relevant = new Set();

    this.state.targetMajors.forEach(majorId => {
      const major = MAJORS[majorId];
      if (!major) return;

      // Add all courses from this major
      const allCourses = [
        ...(major.electiveCourses || []),
        ...(major.primaryCourses || []),
        ...(major.secondaryCourses || []),
        ...(major.coreRequirements || [])
      ];

      allCourses.forEach(code => relevant.add(code));
    });

    return relevant;
  }

  getMajorHighlightColor(courseCode) {
    // Return the department color for this course
    const course = COURSES[courseCode];
    if (!course) return null;
    return DEPT_COLORS[course.department] || '#3b82f6';
  }

  setupInteractiveLegend() {
    const legendItems = document.querySelectorAll('.legend-interactive');
    legendItems.forEach(item => {
      item.addEventListener('click', () => {
        const highlightType = item.getAttribute('data-highlight');
        const isActive = item.classList.contains('active');

        // Clear all active states
        legendItems.forEach(i => i.classList.remove('active'));

        if (isActive) {
          // Turn off - restore normal view
          this.clearLegendHighlight();
        } else {
          // Turn on
          item.classList.add('active');
          this.applyLegendHighlight(highlightType);
        }
      });
    });
  }

  applyLegendHighlight(type) {
    // Clear any existing selection first
    this.clearSelection();

    switch (type) {
      case 'prereq':
        this.highlightAllPrereqConnections();
        break;
      case 'unlock':
        this.highlightAllUnlockConnections();
        break;
      case 'warning-prereq':
        this.highlightNodesWithMissingPrereqs();
        break;
      case 'warning-conflict':
        this.highlightNodesWithConflicts();
        break;
    }
  }

  clearLegendHighlight() {
    // Restore normal view
    this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
      node.style.opacity = '1';
    });
    this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
      line.classList.remove('faded', 'highlighted-upstream', 'highlighted-downstream', 'animated');
    });
  }

  highlightAllPrereqConnections() {
    // Fade all nodes and connections
    this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
      node.style.opacity = '0.4';
    });
    this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
      line.classList.add('faded');
    });

    // Highlight prereq connections and their nodes
    this.connectionsLayer.querySelectorAll('.connection-line[data-type="prereq"]').forEach(line => {
      line.classList.remove('faded');
      line.classList.add('highlighted-upstream', 'animated');

      const fromCode = line.getAttribute('data-from');
      const toCode = line.getAttribute('data-to');

      const fromNode = this.nodesLayer.querySelector(`[data-course="${fromCode}"]`);
      const toNode = this.nodesLayer.querySelector(`[data-course="${toCode}"]`);
      if (fromNode) fromNode.style.opacity = '1';
      if (toNode) toNode.style.opacity = '1';
    });
  }

  highlightAllUnlockConnections() {
    // Fade all nodes and connections
    this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
      node.style.opacity = '0.4';
    });
    this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
      line.classList.add('faded');
    });

    // For unlock connections, we need to check if there are downstream courses
    const nodesWithUnlocks = new Set();
    this.state.plannedCourses.forEach(code => {
      const normalizedCode = code.replace(/\s+/g, '-');
      const downstream = this.getDownstreamCourses(normalizedCode);
      if (downstream.size > 0) {
        nodesWithUnlocks.add(normalizedCode);
        downstream.forEach(d => nodesWithUnlocks.add(d));

        // Highlight the connections from this node
        this.connectionsLayer.querySelectorAll(`[data-from="${normalizedCode}"]`).forEach(line => {
          line.classList.remove('faded');
          line.classList.add('highlighted-downstream', 'animated');
        });
      }
    });

    // Show relevant nodes
    nodesWithUnlocks.forEach(code => {
      const node = this.nodesLayer.querySelector(`[data-course="${code}"]`);
      if (node) node.style.opacity = '1';
    });
  }

  highlightNodesWithMissingPrereqs() {
    const prereqWarnings = getMissingPrerequisites();
    const problemCodes = new Set(prereqWarnings.map(w => w.course.replace(/\s+/g, '-')));

    this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
      const code = node.getAttribute('data-course');
      if (problemCodes.has(code)) {
        node.style.opacity = '1';
      } else {
        node.style.opacity = '0.3';
      }
    });

    this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
      line.classList.add('faded');
    });
  }

  highlightNodesWithConflicts() {
    const conflicts = getScheduleConflicts();
    const conflictCodes = new Set();
    conflicts.forEach(c => {
      conflictCodes.add(c.course1.replace(/\s+/g, '-'));
      conflictCodes.add(c.course2.replace(/\s+/g, '-'));
    });

    this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
      const code = node.getAttribute('data-course');
      if (conflictCodes.has(code)) {
        node.style.opacity = '1';
      } else {
        node.style.opacity = '0.3';
      }
    });

    this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
      line.classList.add('faded');
    });

    // Show conflict connections if any
    this.renderConflictConnectors();
  }

  updateLegendCounts() {
    // Count prerequisite connections
    const prereqCount = this.connectionsLayer.querySelectorAll('.connection-line[data-type="prereq"]').length;
    const prereqCountEl = document.getElementById('prereq-count');
    if (prereqCountEl) prereqCountEl.textContent = `(${prereqCount})`;

    // Count unlock connections (courses that have dependents)
    let unlockCount = 0;
    this.state.plannedCourses.forEach(code => {
      const normalizedCode = code.replace(/\s+/g, '-');
      const downstream = this.getDownstreamCourses(normalizedCode);
      unlockCount += downstream.size;
    });
    const unlockCountEl = document.getElementById('unlock-count');
    if (unlockCountEl) unlockCountEl.textContent = `(${unlockCount})`;

    // Count warning types
    const prereqWarnings = getMissingPrerequisites();
    const warningPrereqCountEl = document.getElementById('warning-prereq-count');
    if (warningPrereqCountEl) warningPrereqCountEl.textContent = `(${prereqWarnings.length})`;

    const conflicts = getScheduleConflicts();
    const warningConflictCountEl = document.getElementById('warning-conflict-count');
    if (warningConflictCountEl) warningConflictCountEl.textContent = `(${conflicts.length})`;
  }

  createMajorRelevanceDots(courseCode) {
    if (this.state.targetMajors.length === 0) return null;

    // Find which target majors this course belongs to
    const relevantMajors = this.state.targetMajors.filter(majorId => {
      const major = MAJORS[majorId];
      if (!major) return false;
      const allCourses = [
        ...(major.electiveCourses || []),
        ...(major.primaryCourses || []),
        ...(major.secondaryCourses || []),
        ...(major.coreRequirements || [])
      ];
      return allCourses.includes(courseCode);
    });

    if (relevantMajors.length === 0) return null;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'major-dots-group');

    const width = GRAPH_CONFIG.nodeWidth;
    const startX = width - 10;
    const startY = 10;
    const dotSize = 6;
    const dotGap = 3;

    // Show max 3 dots, then +N indicator
    const dotsToShow = Math.min(relevantMajors.length, 3);
    const overflow = relevantMajors.length - 3;

    for (let i = 0; i < dotsToShow; i++) {
      const majorId = relevantMajors[i];
      const major = MAJORS[majorId];
      // Get color from primary department of the major
      const color = this.getMajorColor(majorId);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', startX - i * (dotSize + dotGap));
      circle.setAttribute('cy', startY);
      circle.setAttribute('r', dotSize / 2);
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '1');

      // Tooltip
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = major.name;
      circle.appendChild(title);

      g.appendChild(circle);
    }

    if (overflow > 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', startX - dotsToShow * (dotSize + dotGap) - 2);
      text.setAttribute('y', startY + 3);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('class', 'major-dot-overflow');
      text.setAttribute('fill', '#64748b');
      text.setAttribute('font-size', '7px');
      text.textContent = `+${overflow}`;
      g.appendChild(text);
    }

    return g;
  }

  getMajorColor(majorId) {
    // Map majors to their primary department colors
    const majorDeptMap = {
      'finance': 'FNCE',
      'management': 'MGMT',
      'marketing': 'MKTG',
      'operations': 'OIDD',
      'accounting': 'ACCT',
      'statistics': 'STAT',
      'healthcare': 'HCMG',
      'real_estate': 'REAL',
      'entrepreneurship': 'MGMT',
      'strategy': 'MGMT'
    };

    const dept = majorDeptMap[majorId] || 'MGMT';
    return DEPT_COLORS[dept] || '#64748b';
  }

  toggleConflictsMode() {
    this.showConflictsMode = !this.showConflictsMode;
    const conflictBtn = document.getElementById('show-conflicts-btn');

    if (conflictBtn) {
      conflictBtn.classList.toggle('active', this.showConflictsMode);
    }

    if (this.showConflictsMode) {
      this.renderConflictConnectors();
      this.dimNonConflictingNodes();
    } else {
      this.clearConflictConnectors();
      this.restoreAllNodes();
    }
  }

  renderConflictConnectors() {
    // Remove any existing conflict lines
    this.clearConflictConnectors();

    const conflicts = getScheduleConflicts();

    // Update conflict count badge
    const badge = document.getElementById('conflict-count-badge');
    if (badge) {
      if (conflicts.length > 0) {
        badge.textContent = conflicts.length;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    if (conflicts.length === 0) return;

    conflicts.forEach(conflict => {
      const code1 = conflict.course1.replace(/\s+/g, '-');
      const code2 = conflict.course2.replace(/\s+/g, '-');

      const pos1 = this.nodePositions.get(code1);
      const pos2 = this.nodePositions.get(code2);

      if (!pos1 || !pos2) return;

      this.drawConflictConnection(pos1, pos2, code1, code2, conflict);
    });
  }

  drawConflictConnection(pos1, pos2, code1, code2, conflict) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Draw a curved line between the two conflicting courses
    const startX = pos1.right;
    const startY = pos1.y;
    const endX = pos2.left;
    const endY = pos2.y;

    // If they're in the same column, draw an arc
    const sameColumn = Math.abs(pos1.x - pos2.x) < 50;
    let d;

    if (sameColumn) {
      // Vertical connection with curve to the right
      const arcX = Math.max(pos1.right, pos2.right) + 30;
      d = `M ${pos1.right} ${startY}
           Q ${arcX} ${startY}, ${arcX} ${(startY + endY) / 2}
           Q ${arcX} ${endY}, ${pos2.right} ${endY}`;
    } else {
      // Standard bezier between nodes
      const controlOffset = Math.abs(endX - startX) / 3;
      d = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
    }

    path.setAttribute('d', d);
    path.setAttribute('class', 'connection-line conflict');
    path.setAttribute('data-from', code1);
    path.setAttribute('data-to', code2);
    path.setAttribute('data-conflict', 'true');

    // Tooltip for conflict info
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Conflict: ${conflict.course1} and ${conflict.course2} both scheduled for Weekend ${conflict.weekend + 1} in ${conflict.term}`;
    path.appendChild(title);

    this.connectionsLayer.appendChild(path);
  }

  clearConflictConnectors() {
    const conflictLines = this.connectionsLayer.querySelectorAll('[data-conflict="true"]');
    conflictLines.forEach(line => line.remove());
  }

  dimNonConflictingNodes() {
    const conflicts = getScheduleConflicts();
    const conflictingCodes = new Set();

    conflicts.forEach(c => {
      conflictingCodes.add(c.course1.replace(/\s+/g, '-'));
      conflictingCodes.add(c.course2.replace(/\s+/g, '-'));
    });

    this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
      const code = node.getAttribute('data-course');
      if (!conflictingCodes.has(code)) {
        node.style.opacity = '0.3';
      } else {
        node.classList.add('conflict-highlighted');
      }
    });

    // Also dim non-conflict connection lines
    this.connectionsLayer.querySelectorAll('.connection-line:not([data-conflict])').forEach(line => {
      line.style.opacity = '0.1';
    });
  }

  restoreAllNodes() {
    this.nodesLayer.querySelectorAll('.course-node').forEach(node => {
      node.style.opacity = '1';
      node.classList.remove('conflict-highlighted');
    });

    this.connectionsLayer.querySelectorAll('.connection-line').forEach(line => {
      line.style.opacity = '';
    });
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
    this.showCourseInfoPanel(courseCode);
    this.renderGhostNodes(courseCode);
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
    this.hideCourseInfoPanel();
    this.clearGhostNodes();
  }

  showCourseInfoPanel(courseCode) {
    const panel = document.getElementById('course-info-panel');
    const titleEl = document.getElementById('info-panel-title');
    const prereqsList = document.getElementById('info-prereqs-list');
    const unlocksList = document.getElementById('info-unlocks-list');
    const prereqsSection = document.getElementById('info-prereqs-section');
    const unlocksSection = document.getElementById('info-unlocks-section');

    if (!panel) return;

    const normalizedCode = courseCode.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (!course) return;

    titleEl.textContent = course.code.replace('-', ' ');

    // Get courses in plan
    const cohort = this.state.selectedCohort;
    const plannedSet = new Set(this.state.plannedCourses.map(c => c.replace(/\s+/g, '-')));
    const coreCurriculum = CORE_CURRICULUM[cohort];
    const coreSet = new Set();
    ['T1', 'T2', 'T3'].forEach(term => {
      (coreCurriculum[term] || []).forEach(c => coreSet.add(c.code));
    });
    if (this.state.financeChoice === 'FNCE-6110') {
      coreSet.add('FNCE-6110');
    } else {
      coreSet.add('FNCE-6210');
    }

    // Render prerequisites
    const prereqs = course.prerequisites || [];
    if (prereqs.length === 0) {
      prereqsSection.style.display = 'none';
    } else {
      prereqsSection.style.display = 'block';
      prereqsList.innerHTML = prereqs.map(prereqCode => {
        const prereqCourse = COURSES[prereqCode];
        const prereqName = prereqCourse ? prereqCourse.code.replace('-', ' ') : prereqCode.replace('-', ' ');
        const inCore = coreSet.has(prereqCode);
        const inPlan = plannedSet.has(prereqCode);

        let statusHtml;
        if (inCore) {
          statusHtml = '<span class="prereq-status in-core">✓ Core</span>';
        } else if (inPlan) {
          statusHtml = '<span class="prereq-status in-plan">✓ In Plan</span>';
        } else {
          statusHtml = `<button class="add-prereq-btn" onclick="addCourse('${prereqCode}')">+ Add</button>`;
        }

        return `<li><span>${prereqName}</span>${statusHtml}</li>`;
      }).join('');
    }

    // Render unlocks (courses that have this as a prerequisite)
    const unlocks = this.getCoursesUnlockedBy(normalizedCode);
    if (unlocks.length === 0) {
      unlocksSection.style.display = 'none';
    } else {
      unlocksSection.style.display = 'block';
      unlocksList.innerHTML = unlocks.map(unlockCode => {
        const unlockCourse = COURSES[unlockCode];
        const unlockName = unlockCourse ? unlockCourse.code.replace('-', ' ') : unlockCode.replace('-', ' ');
        const inPlan = plannedSet.has(unlockCode);
        const statusText = inPlan ? 'In Plan' : 'Available';

        return `<li><span class="unlock-course">${unlockName}</span><span class="unlock-status">${statusText}</span></li>`;
      }).join('');
    }

    // Setup close button
    document.getElementById('info-panel-close').onclick = () => this.clearSelection();

    panel.classList.remove('hidden');
  }

  hideCourseInfoPanel() {
    const panel = document.getElementById('course-info-panel');
    if (panel) {
      panel.classList.add('hidden');
    }
  }

  getCoursesUnlockedBy(courseCode) {
    const unlocks = [];
    const cohort = this.state.selectedCohort;

    Object.entries(COURSES).forEach(([code, course]) => {
      if (!course.prerequisites) return;
      if (!course.offerings?.[cohort]) return;

      if (course.prerequisites.includes(courseCode)) {
        unlocks.push(code);
      }
    });

    return unlocks;
  }

  renderGhostNodes(courseCode) {
    this.clearGhostNodes();

    const normalizedCode = courseCode.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (!course || !course.prerequisites) return;

    const cohort = this.state.selectedCohort;
    const plannedSet = new Set(this.state.plannedCourses.map(c => c.replace(/\s+/g, '-')));
    const coreSet = new Set();
    const coreCurriculum = CORE_CURRICULUM[cohort];
    ['T1', 'T2', 'T3'].forEach(term => {
      (coreCurriculum[term] || []).forEach(c => coreSet.add(c.code));
    });
    if (this.state.financeChoice === 'FNCE-6110') {
      coreSet.add('FNCE-6110');
    }

    // Find missing prerequisites that are not in core or plan
    const missingPrereqs = course.prerequisites.filter(prereqCode =>
      !plannedSet.has(prereqCode) && !coreSet.has(prereqCode)
    );

    if (missingPrereqs.length === 0) return;

    const selectedNodePos = this.nodePositions.get(normalizedCode);
    if (!selectedNodePos) return;

    // Position ghost nodes to the left of the selected node
    missingPrereqs.forEach((prereqCode, index) => {
      const prereqCourse = COURSES[prereqCode];
      if (!prereqCourse) return;

      // Check if prereq is available for this cohort
      if (!prereqCourse.offerings?.[cohort]) return;

      const ghostX = selectedNodePos.left - GRAPH_CONFIG.columnWidth - 20;
      const ghostY = selectedNodePos.top + index * (GRAPH_CONFIG.nodeHeight + 20);

      const ghostNode = this.createGhostNode(prereqCode, prereqCourse, ghostX, ghostY);
      this.nodesLayer.appendChild(ghostNode);

      // Draw ghost connection
      const ghostConnection = this.drawGhostConnection(
        { x: ghostX + GRAPH_CONFIG.nodeWidth, y: ghostY + GRAPH_CONFIG.nodeHeight / 2 },
        { x: selectedNodePos.left, y: selectedNodePos.y }
      );
      this.connectionsLayer.appendChild(ghostConnection);
    });
  }

  createGhostNode(courseCode, course, x, y) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'ghost-node');
    g.setAttribute('data-ghost-course', courseCode);
    g.setAttribute('transform', `translate(${x}, ${y})`);

    const width = GRAPH_CONFIG.nodeWidth;
    const height = GRAPH_CONFIG.nodeHeight;
    const deptColor = DEPT_COLORS[course.department] || '#64748b';

    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('class', 'node-bg');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    g.appendChild(bg);

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

    // Course title
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

    // "Click to add" text
    const addText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    addText.setAttribute('class', 'node-credits');
    addText.setAttribute('x', 10);
    addText.setAttribute('y', 58);
    addText.textContent = '+ Click to add';
    addText.setAttribute('fill', '#3b82f6');
    g.appendChild(addText);

    // Click to add course
    g.addEventListener('click', (e) => {
      e.stopPropagation();
      addCourse(courseCode);
    });

    // Tooltip
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${course.code.replace('-', ' ')}: ${course.title}\nClick to add to your plan`;
    g.appendChild(title);

    return g;
  }

  drawGhostConnection(fromPos, toPos) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    const startX = fromPos.x;
    const startY = fromPos.y;
    const endX = toPos.x;
    const endY = toPos.y;

    const controlOffset = Math.min(50, Math.abs(endX - startX) / 2);
    const d = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;

    path.setAttribute('d', d);
    path.setAttribute('class', 'ghost-connection');
    path.setAttribute('data-ghost', 'true');

    return path;
  }

  clearGhostNodes() {
    // Remove ghost nodes
    this.nodesLayer.querySelectorAll('.ghost-node').forEach(node => node.remove());
    // Remove ghost connections
    this.connectionsLayer.querySelectorAll('[data-ghost="true"]').forEach(conn => conn.remove());
  }

  // Render methods (to be implemented in later tasks)
  render() {
    this.renderDropZones();
    this.renderNodes();
    this.renderConnections();
    this.updateStats();
    this.updateConflictBadge();
    this.updateLegendCounts();
    this.updateMajorsDisplay();

    // Re-apply conflict mode if active
    if (this.showConflictsMode) {
      this.renderConflictConnectors();
      this.dimNonConflictingNodes();
    }

    // Apply major display mode
    this.applyMajorDisplayMode();
  }

  updateConflictBadge() {
    const conflicts = getScheduleConflicts();
    const badge = document.getElementById('conflict-count-badge');
    if (badge) {
      if (conflicts.length > 0) {
        badge.textContent = conflicts.length;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

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
    const nodeFullHeight = GRAPH_CONFIG.nodeHeight + GRAPH_CONFIG.nodeBadgeHeight + GRAPH_CONFIG.nodeGap;
    const calculatedHeight = GRAPH_CONFIG.headerHeight +
      coursesInTerm.length * nodeFullHeight +
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

        const nodeFullHeight = GRAPH_CONFIG.nodeHeight + GRAPH_CONFIG.nodeBadgeHeight + GRAPH_CONFIG.nodeGap;
        const x = columnX + (GRAPH_CONFIG.columnWidth - GRAPH_CONFIG.nodeWidth) / 2;
        const y = GRAPH_CONFIG.padding + GRAPH_CONFIG.headerHeight +
                  courseIndex * nodeFullHeight;

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

    // Prerequisite status badge (below node)
    const prereqBadge = this.createPrereqStatusBadge(courseCode, width);
    if (prereqBadge) {
      g.appendChild(prereqBadge);
    }

    // Major relevance dots (top-right corner)
    const majorDots = this.createMajorRelevanceDots(courseCode);
    if (majorDots) {
      g.appendChild(majorDots);
    }

    // Remove button (X) in top-right corner
    const removeBtn = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    removeBtn.setAttribute('class', 'node-remove-btn');
    removeBtn.setAttribute('transform', `translate(${width - 18}, 8)`);

    const removeBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    removeBg.setAttribute('cx', 0);
    removeBg.setAttribute('cy', 0);
    removeBg.setAttribute('r', 8);
    removeBg.setAttribute('class', 'remove-btn-bg');
    removeBtn.appendChild(removeBg);

    const removeX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    removeX.setAttribute('x', 0);
    removeX.setAttribute('y', 4);
    removeX.setAttribute('text-anchor', 'middle');
    removeX.setAttribute('class', 'remove-btn-x');
    removeX.textContent = '×';
    removeBtn.appendChild(removeX);

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeCourse(courseCode);
    });

    g.appendChild(removeBtn);

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
      const cohort = this.state.selectedCohort;
      const relevantConflicts = conflicts.filter(c =>
        c.course1 === normalizedCode || c.course2 === normalizedCode
      );
      relevantConflicts.forEach(c => {
        const otherCourse = c.course1 === normalizedCode ? c.course2 : c.course1;
        // Get more detailed conflict info
        const schedule = SCHEDULE[cohort]?.[c.term.includes('Term') ? `T${c.term.match(/\d/)?.[0]}` : c.term];
        const weekendInfo = schedule?.weekends?.[c.weekend];
        const weekendDates = weekendInfo ? ` (${weekendInfo})` : '';
        messages.push(`Conflicts with ${otherCourse} on Weekend ${c.weekend + 1}${weekendDates}`);
      });
    }

    return messages.join('\n');
  }

  createPrereqStatusBadge(courseCode, nodeWidth) {
    const normalizedCode = courseCode.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (!course) return null;

    // Check if course has prerequisites
    if (!course.prerequisites || course.prerequisites.length === 0) {
      // No prerequisites - show green checkmark
      return this.createBadgeElement(nodeWidth, '✓ No prereqs', 'success');
    }

    // Get courses in plan for checking
    const cohort = this.state.selectedCohort;
    const plannedSet = new Set(this.state.plannedCourses.map(c => c.replace(/\s+/g, '-')));

    // Add core curriculum
    const coreCurriculum = CORE_CURRICULUM[cohort];
    ['T1', 'T2', 'T3'].forEach(term => {
      (coreCurriculum[term] || []).forEach(c => plannedSet.add(c.code));
    });

    // Handle finance choice
    if (cohort !== 'global') {
      if (this.state.financeChoice === 'FNCE-6110') {
        plannedSet.add('FNCE-6110');
      } else {
        plannedSet.add('FNCE-6210');
      }
    } else {
      plannedSet.add('FNCE-6110');
    }

    // Check missing prerequisites
    const missing = course.prerequisites.filter(prereq => !plannedSet.has(prereq));

    if (missing.length === 0) {
      return this.createBadgeElement(nodeWidth, '✓ Prereqs met', 'success');
    } else if (missing.length === 1) {
      const prereqCourse = COURSES[missing[0]];
      const prereqName = prereqCourse ? prereqCourse.code.replace('-', ' ') : missing[0].replace('-', ' ');
      return this.createBadgeElement(nodeWidth, `Needs: ${prereqName}`, 'warning');
    } else {
      return this.createBadgeElement(nodeWidth, `Needs: ${missing.length} courses`, 'warning');
    }
  }

  createBadgeElement(nodeWidth, text, type) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `prereq-badge prereq-badge-${type}`);

    const height = GRAPH_CONFIG.nodeHeight;
    const badgeY = height + 4;
    const badgeHeight = 14;
    const badgeWidth = nodeWidth - 20;

    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', 10);
    bg.setAttribute('y', badgeY);
    bg.setAttribute('width', badgeWidth);
    bg.setAttribute('height', badgeHeight);
    bg.setAttribute('rx', 3);
    bg.setAttribute('class', `prereq-badge-bg prereq-badge-bg-${type}`);
    g.appendChild(bg);

    // Text
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('x', 10 + badgeWidth / 2);
    textEl.setAttribute('y', badgeY + 10);
    textEl.setAttribute('text-anchor', 'middle');
    textEl.setAttribute('class', `prereq-badge-text prereq-badge-text-${type}`);
    textEl.textContent = text;
    g.appendChild(textEl);

    return g;
  }

  makeNodeDraggable(nodeElement, courseCode) {
    let isDragging = false;
    let startX, startY;
    let originalTransform;
    const self = this;

    nodeElement.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click

      isDragging = true;
      const transform = nodeElement.getAttribute('transform');
      startX = e.clientX;
      startY = e.clientY;
      originalTransform = transform;

      nodeElement.classList.add('dragging');
      document.getElementById('trash-dropzone')?.classList.remove('hidden');

      e.preventDefault();
      e.stopPropagation();
    });

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const dx = (e.clientX - startX) / self.zoom;
      const dy = (e.clientY - startY) / self.zoom;

      const match = originalTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (match) {
        const newX = parseFloat(match[1]) + dx;
        const newY = parseFloat(match[2]) + dy;
        nodeElement.setAttribute('transform', `translate(${newX}, ${newY})`);
      }

      // Highlight drop zones
      self.highlightDropZone(e.clientX, e.clientY, courseCode);
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;
      isDragging = false;

      nodeElement.classList.remove('dragging');
      document.getElementById('trash-dropzone')?.classList.add('hidden');
      self.clearDropZoneHighlights();

      // Check if dropped on trash
      const trashZone = document.getElementById('trash-dropzone');
      if (trashZone && self.isOverElement(e.clientX, e.clientY, trashZone)) {
        removeCourse(courseCode);
        return;
      }

      // Check if dropped on a valid term column
      const targetTerm = self.getDropTargetTerm(e.clientX, e.clientY, courseCode);
      if (targetTerm) {
        self.moveCourseToTerm(courseCode, targetTerm);
      } else {
        // Snap back
        nodeElement.setAttribute('transform', originalTransform);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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

  drawConnection(fromPos, toPos, fromCode, toCode, connectionType = 'prereq') {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Calculate bezier curve
    const startX = fromPos.right;
    const startY = fromPos.y;
    const endX = toPos.left;
    const endY = toPos.y;

    const controlOffset = Math.min(80, Math.abs(endX - startX) / 2);

    const d = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;

    path.setAttribute('d', d);
    path.setAttribute('class', 'connection-line');
    path.setAttribute('data-from', fromCode);
    path.setAttribute('data-to', toCode);
    path.setAttribute('data-type', connectionType);

    // Add hover event for connection labels
    path.addEventListener('mouseenter', () => this.showConnectionLabel(path, fromCode, toCode, connectionType));
    path.addEventListener('mouseleave', () => this.hideConnectionLabel());

    this.connectionsLayer.appendChild(path);
  }

  showConnectionLabel(path, fromCode, toCode, connectionType) {
    // Remove any existing label
    this.hideConnectionLabel();

    // Get midpoint of path for label placement
    const pathLength = path.getTotalLength();
    const midPoint = path.getPointAtLength(pathLength / 2);

    // Create label group
    const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelGroup.setAttribute('class', 'connection-label-group');

    // Label text
    const labelText = connectionType === 'prereq' ? 'Requires' : 'Unlocks';

    // Background rect
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('class', 'connection-label-bg');
    bg.setAttribute('x', midPoint.x - 25);
    bg.setAttribute('y', midPoint.y - 8);
    bg.setAttribute('width', 50);
    bg.setAttribute('height', 14);
    bg.setAttribute('rx', 3);
    labelGroup.appendChild(bg);

    // Text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('class', `connection-label visible ${connectionType}-label`);
    text.setAttribute('x', midPoint.x);
    text.setAttribute('y', midPoint.y + 3);
    text.setAttribute('text-anchor', 'middle');
    text.textContent = labelText;
    labelGroup.appendChild(text);

    this.connectionsLayer.appendChild(labelGroup);
  }

  hideConnectionLabel() {
    const labelGroup = this.connectionsLayer.querySelector('.connection-label-group');
    if (labelGroup) {
      labelGroup.remove();
    }
  }

  drawConnectionFromCore(prereqCode, toPos, toCode) {
    // For prerequisites in core curriculum, draw from left side of graph
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    const startX = 0;
    const startY = toPos.y;
    const endX = toPos.left;
    const endY = toPos.y;

    const d = `M ${startX} ${startY} C ${startX + 40} ${startY}, ${endX - 40} ${endY}, ${endX} ${endY}`;

    path.setAttribute('d', d);
    path.setAttribute('class', 'connection-line core-prereq');
    path.setAttribute('data-from', prereqCode);
    path.setAttribute('data-to', toCode);
    path.setAttribute('data-type', 'prereq');

    // Add hover event for connection labels
    path.addEventListener('mouseenter', () => this.showConnectionLabel(path, prereqCode, toCode, 'prereq'));
    path.addEventListener('mouseleave', () => this.hideConnectionLabel());

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
      line.classList.remove('highlighted-upstream', 'highlighted-downstream', 'animated');
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
        line.classList.add('highlighted-upstream', 'animated');
      }
    });

    // Highlight all connections leading to selected node with animation
    this.connectionsLayer.querySelectorAll(`[data-to="${normalizedCode}"]`).forEach(line => {
      line.classList.remove('faded');
      line.classList.add('highlighted-upstream', 'animated');
    });

    // Highlight downstream
    downstream.forEach(code => {
      const nodeEl = this.nodesLayer.querySelector(`[data-course="${code}"]`);
      if (nodeEl) nodeEl.style.opacity = '1';
    });

    // Highlight all connections from selected node with animation
    this.connectionsLayer.querySelectorAll(`[data-from="${normalizedCode}"]`).forEach(line => {
      line.classList.remove('faded');
      line.classList.add('highlighted-downstream', 'animated');
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
    const emptyState = document.getElementById('catalog-empty');
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

    // If target majors selected, show by major
    if (this.state.targetMajors.length > 0) {
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
    } else {
      // No majors selected - show all courses by department
      const coursesByDept = {};

      Object.entries(COURSES).forEach(([code, course]) => {
        if (!course.offerings?.[cohort]) return;
        const dept = course.department;
        if (!coursesByDept[dept]) coursesByDept[dept] = [];

        const inPlan = plannedSet.has(code);
        const prereqsMet = this.arePrereqsMet(code, allPlannedCourses);
        const offering = course.offerings[cohort];
        coursesByDept[dept].push({ code, course, inPlan, prereqsMet, offering });
      });

      Object.entries(coursesByDept).forEach(([dept, courses]) => {
        const deptName = DEPARTMENTS[dept]?.name || dept;
        const inPlanCount = courses.filter(c => c.inPlan).length;

        html += `
          <div class="catalog-major" data-dept="${dept}">
            <div class="catalog-major-header" onclick="toggleCatalogMajor('${dept}')">
              <h4>${deptName}</h4>
              <span class="badge">${inPlanCount}/${courses.length}</span>
              <span class="chevron">▼</span>
            </div>
            <div class="catalog-courses">
              ${courses.map(c => this.renderCatalogCourse(c)).join('')}
            </div>
          </div>
        `;
      });
    }

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

  // Toggle expand/collapse - remove old listeners by cloning
  const expandBtn = document.getElementById('core-expand-btn');
  const collapseBtn = document.getElementById('core-collapse-btn');

  if (expandBtn) {
    const newExpandBtn = expandBtn.cloneNode(true);
    expandBtn.parentNode.replaceChild(newExpandBtn, expandBtn);
    newExpandBtn.addEventListener('click', () => {
      document.getElementById('core-collapsed').classList.add('hidden');
      document.getElementById('core-expanded').classList.remove('hidden');
    });
  }

  if (collapseBtn) {
    const newCollapseBtn = collapseBtn.cloneNode(true);
    collapseBtn.parentNode.replaceChild(newCollapseBtn, collapseBtn);
    newCollapseBtn.addEventListener('click', () => {
      document.getElementById('core-expanded').classList.add('hidden');
      document.getElementById('core-collapsed').classList.remove('hidden');
    });
  }
}

// Toggle catalog major section collapse
function toggleCatalogMajor(majorId) {
  const section = document.querySelector(`.catalog-major[data-major="${majorId}"]`);
  if (section) {
    section.classList.toggle('collapsed');
  }
}

window.toggleCatalogMajor = toggleCatalogMajor;

// Export for use in app.js
window.initGraphBuilder = initGraphBuilder;
window.renderGraphView = renderGraphView;
