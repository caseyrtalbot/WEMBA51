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
    this.setupDropZoneListeners();
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

  drawConnection(fromPos, toPos, fromCode, toCode) {
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

    this.connectionsLayer.appendChild(path);
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
