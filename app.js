// WEMBA 51 Pathway Planner - Application Logic

// Application State
let state = {
  selectedCohort: null,
  plannedCourses: [],
  targetMajors: [],
  waivedCourses: [],
  completedBlockCourses: [], // Early block courses completed during T1-T3
  financeChoice: null, // 'FNCE-6110' or 'FNCE-6210'
  currentView: 'dashboard',
  explorerMode: 'majors',
  selectedMajor: null,
  selectedDepartment: null,
  highlightedMajorCourses: [] // Course codes to highlight across all views
};

function getTermLabel(offering) {
  if (!offering) return '';
  if (offering.term === 'BW') {
    if (offering.category === 'GMC') return 'Global Modular Course';
    if (offering.category === 'GIP') return 'Global Immersion Program';
    return 'Block Week';
  }
  return `Term ${offering.term.slice(1)}`;
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initEventListeners();
  initRouter();

  // Handle initial state based on URL and saved state
  const currentRoute = router.getCurrentRoute();

  if (state.selectedCohort) {
    // Has cohort - check if URL specifies a view
    if (currentRoute.screen === 'main-app') {
      showMainApp(false); // Don't animate on page load
      if (currentRoute.view) {
        activateView(currentRoute.view);
      }
    } else {
      // URL is landing page but we have cohort - go to dashboard
      router.navigate('/dashboard', { replace: true });
    }
  } else {
    // No cohort - ensure we're on landing page
    if (currentRoute.screen !== 'cohort-selection') {
      router.navigate('/', { replace: true });
    }
  }
});

// Initialize router and set up route change handler
function initRouter() {
  router.onRouteChange((route, path) => {
    if (route.screen === 'cohort-selection') {
      // Show landing page
      const cohortSelection = document.getElementById('cohort-selection');
      const mainApp = document.getElementById('main-app');
      cohortSelection.classList.remove('hidden');
      cohortSelection.classList.add('active');
      mainApp.classList.remove('active');
    } else if (route.screen === 'main-app' && route.view) {
      // Show main app with specific view
      const cohortSelection = document.getElementById('cohort-selection');
      const mainApp = document.getElementById('main-app');

      if (!mainApp.classList.contains('active')) {
        // Main app not visible yet - show it without animation
        cohortSelection.classList.remove('active');
        cohortSelection.classList.add('hidden');
        mainApp.classList.add('active');

        // Ensure data is loaded
        updateCohortDisplay();
        populateSidebar();
        updateDashboard();
        updatePathway();
      }

      // Activate the requested view
      activateView(route.view);
    }
  });
}

// Activate a view without changing URL (internal use)
function activateView(viewName) {
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
    if (typeof initGraphBuilder === 'function') {
      initGraphBuilder();
    }
  }
}

// Event Listeners
function initEventListeners() {
  // Cohort selection
  document.querySelectorAll('.cohort-card').forEach(card => {
    card.addEventListener('click', () => {
      selectCohort(card.dataset.cohort);
    });
  });

  // Cohort switcher - navigate to landing page via router
  document.getElementById('cohort-switcher').addEventListener('click', () => {
    router.navigate('/');
  });

  // Navigation tabs - use router for URL-based navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate('/' + tab.dataset.view);
    });
  });

  // Browse toggle (majors/departments)
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setBrowseMode(btn.dataset.browse);
    });
  });

  // Search
  document.getElementById('course-search').addEventListener('input', (e) => {
    filterCourses(e.target.value);
  });

  // Finance decision buttons
  document.querySelectorAll('.decision-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setFinanceChoice(btn.dataset.choice);
    });
  });
}

// Cohort Selection
function selectCohort(cohortId) {
  // Add visual feedback to selected card
  const selectedCard = document.querySelector(`.cohort-card[data-cohort="${cohortId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  // Reset graph builder instances when cohort changes (prevents stale event listeners)
  if (typeof resetGraphBuilder === 'function') {
    resetGraphBuilder();
  }

  if (cohortId === 'global') {
    // Global cohort: auto-select FNCE-6110 and proceed directly
    state.selectedCohort = cohortId;
    state.financeChoice = 'FNCE-6110';
    saveState();

    // Brief delay before transition for click feedback
    setTimeout(() => {
      showMainApp();
    }, 150);
  } else {
    // PHL/SF cohorts: show finance choice modal
    state.pendingCohort = cohortId;
    showFinanceModal();
  }
}

// Finance Choice Modal Functions
function showFinanceModal() {
  const modal = document.getElementById('finance-choice-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeFinanceModal() {
  const modal = document.getElementById('finance-choice-modal');
  if (modal) {
    modal.classList.add('hidden');
  }

  // Reset selected card state if user cancels
  document.querySelectorAll('.cohort-card.selected').forEach(card => {
    card.classList.remove('selected');
  });
  state.pendingCohort = null;
}

function selectFinanceAndProceed(choice) {
  // Set cohort and finance choice
  state.selectedCohort = state.pendingCohort;
  state.financeChoice = choice;
  state.pendingCohort = null;
  saveState();

  // Close modal
  const modal = document.getElementById('finance-choice-modal');
  if (modal) {
    modal.classList.add('hidden');
  }

  // Proceed to main app
  showMainApp();
}

function showMainApp(animate = true) {
  const cohortSelection = document.getElementById('cohort-selection');
  const mainApp = document.getElementById('main-app');

  // Prepare data first
  updateCohortDisplay();
  populateSidebar();
  updateDashboard();
  updatePathway();

  if (!animate) {
    // No animation - just switch screens
    cohortSelection.classList.remove('active', 'transitioning', 'sliding-up');
    cohortSelection.classList.add('hidden');
    mainApp.classList.add('active');
    mainApp.classList.remove('snap-in');
    return;
  }

  // Remove hidden class if returning from main app
  cohortSelection.classList.remove('hidden');

  // Step 1: Make cohort selection fixed position (so main app can show behind)
  cohortSelection.classList.add('transitioning');

  // Step 2: Show main app behind the cohort selection
  mainApp.classList.add('active');
  mainApp.classList.add('snap-in');

  // Step 3: Slide cohort selection up (after a tiny delay to ensure layout)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cohortSelection.classList.add('sliding-up');
    });
  });

  // Step 4: Clean up after animation completes and navigate to dashboard
  setTimeout(() => {
    // Hide cohort selection completely
    cohortSelection.classList.remove('active', 'transitioning', 'sliding-up');
    cohortSelection.classList.add('hidden');

    // Clean up main app animation class
    mainApp.classList.remove('snap-in');

    // Reset any selected card states
    document.querySelectorAll('.cohort-card.selected').forEach(card => {
      card.classList.remove('selected');
    });

    // Navigate to dashboard via router (will update URL)
    router.navigate('/dashboard', { replace: true });
  }, 600);
}

function updateCohortDisplay() {
  const cohort = COHORTS[state.selectedCohort];
  document.getElementById('current-cohort-name').textContent = cohort.name;

  // Update sidebar cohort icon
  const cohortIcon = document.getElementById('cohort-icon-display');
  if (cohortIcon) {
    const iconMap = { philadelphia: 'PHL', san_francisco: 'SF', global: 'GLO' };
    cohortIcon.textContent = iconMap[state.selectedCohort] || 'PHL';
  }

  // Hide finance decision for Global cohort
  const financeCard = document.getElementById('finance-decision-card');
  if (state.selectedCohort === 'global') {
    financeCard.style.display = 'none';
  } else {
    financeCard.style.display = 'block';
    updateFinanceDecision();
  }
}

// Finance Decision
function setFinanceChoice(choice) {
  state.financeChoice = choice;
  saveState();

  // Update all credit displays across all views instantly
  updateAllCreditDisplays();

  document.querySelectorAll('.decision-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.choice === choice);
  });

  // Refresh view-specific content
  updateDashboard();
  updatePathway();

  // Update graph view if active
  if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
    renderGraphView();
  }
}

function updateFinanceDecision() {
  document.querySelectorAll('.decision-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.choice === state.financeChoice);
  });
}

// View Navigation - now uses router for URL-based navigation
function switchView(viewName) {
  router.navigate('/' + viewName);
}

// Navigate to Explorer filtered by a specific major
function navigateToMajor(majorId) {
  router.navigate('/explorer');
  // Need to wait for route change to complete before setting mode
  setTimeout(() => {
    setBrowseMode('majors');
    selectMajor(majorId);
  }, 50);
}

// Dashboard
function updateDashboard() {
  const totalCU = calculateTotalCU();
  const progress = (totalCU / PROGRAM_RULES.graduationMinimum) * 100;

  // Update progress display
  document.getElementById('total-cu').textContent = totalCU.toFixed(1);
  document.getElementById('progress-cu').textContent = totalCU.toFixed(1);
  document.getElementById('progress-bar').style.width = `${Math.min(progress, 100)}%`;
  document.getElementById('progress-percent').textContent = `(${Math.round(progress)}%)`;

  // Update sidebar progress (new design)
  const sidebarCu = document.getElementById('sidebar-cu-display');
  const sidebarPercent = document.getElementById('sidebar-progress-percent');
  const sidebarFill = document.getElementById('sidebar-progress-fill');
  if (sidebarCu) sidebarCu.textContent = totalCU.toFixed(1);
  if (sidebarPercent) sidebarPercent.textContent = `${Math.round(progress)}%`;
  if (sidebarFill) sidebarFill.style.width = `${Math.min(progress, 100)}%`;

  // Update graduation status
  const statusEl = document.getElementById('graduation-status');
  if (totalCU >= PROGRAM_RULES.graduationMinimum) {
    statusEl.textContent = 'Graduation Ready';
    statusEl.className = 'status-badge ready';
  } else {
    const needed = (PROGRAM_RULES.graduationMinimum - totalCU).toFixed(1);
    statusEl.textContent = `Need ${needed} more CU`;
    statusEl.className = 'status-badge pending';
  }

  // Update major progress
  updateMajorProgress();

  // Update completed block courses
  updateCompletedBlockCourses();

  // Update alerts
  updateAlerts();
}

function updateMajorProgress() {
  const container = document.getElementById('major-progress-content');

  if (state.targetMajors.length === 0) {
    container.innerHTML = `
      <p class="empty-state">No major selected</p>
      <button class="btn-secondary" onclick="switchView('explorer')">Explore Majors</button>
    `;
    return;
  }

  let html = '';
  state.targetMajors.forEach(majorId => {
    const major = MAJORS[majorId];
    const progress = calculateMajorProgress(majorId);
    const percent = (progress.completed / major.requiredCUs) * 100;

    html += `
      <div class="major-progress-item clickable" data-major="${majorId}" onclick="navigateToMajor('${majorId}')">
        <div class="major-info">
          <strong>${major.name}</strong>
          <span>${progress.completed.toFixed(1)} / ${major.requiredCUs} CU</span>
        </div>
        <div class="progress-bar-container" style="height: 8px; margin-top: 0.5rem;">
          <div class="progress-bar" style="width: ${Math.min(percent, 100)}%"></div>
        </div>
        ${percent >= 100 ? '<span class="status-badge ready" style="margin-top: 0.5rem;">Complete</span>' : ''}
        <span class="major-progress-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    `;
  });

  container.innerHTML = html;

  // Update sidebar major status
  const sidebarMajor = document.getElementById('sidebar-major-status');
  if (sidebarMajor) {
    if (state.targetMajors.length === 0) {
      sidebarMajor.innerHTML = '<span class="major-label">Major</span><span class="major-value">Not Selected</span>';
    } else {
      const majorNames = state.targetMajors.map(id => MAJORS[id].name).join(', ');
      sidebarMajor.innerHTML = `<span class="major-label">Major</span><span class="major-value">${majorNames}</span>`;
    }
  }
}

function updateCompletedBlockCourses() {
  const container = document.getElementById('completed-block-courses-content');
  if (!container) return;

  const availableCourses = getEarlyBlockCoursesForCohort(state.selectedCohort);
  const completedCU = getCompletedBlockCoursesCU();

  if (availableCourses.length === 0) {
    container.innerHTML = '<p class="empty-state">No block courses available for your cohort</p>';
    return;
  }

  // Group by term
  const coursesByTerm = { T1: [], T2: [] };
  availableCourses.forEach(course => {
    if (coursesByTerm[course.term]) {
      coursesByTerm[course.term].push(course);
    }
  });

  let html = `<div class="block-courses-summary">
    <span class="block-cu-total">${completedCU.toFixed(1)} CU</span> from block courses
  </div>`;

  ['T1', 'T2'].forEach(term => {
    const courses = coursesByTerm[term];
    if (courses.length === 0) return;

    const termLabel = term === 'T1' ? 'Term 1 (August)' : 'Term 2 (Fall)';
    html += `<div class="block-term-group">
      <h4 class="block-term-label">${termLabel}</h4>
      <div class="block-courses-list">`;

    courses.forEach(course => {
      const isCompleted = state.completedBlockCourses.includes(course.code);
      html += `
        <div class="block-course-item ${isCompleted ? 'completed' : ''}">
          <div class="block-course-info">
            <span class="block-course-title">${course.title}</span>
            <span class="block-course-meta">${course.credits} CU · ${course.dates} · ${course.location}</span>
          </div>
          <button class="block-course-btn ${isCompleted ? 'added' : ''}"
                  onclick="toggleCompletedBlockCourse('${course.code}')">
            ${isCompleted ? '✓ Added' : '+ Add'}
          </button>
        </div>
      `;
    });

    html += '</div></div>';
  });

  container.innerHTML = html;
}

function updateAlerts() {
  const alertsList = document.getElementById('alerts-list');
  const alerts = generateAlerts();

  if (alerts.length === 0) {
    alertsList.innerHTML = '<li class="alert-item success">Your plan looks good!</li>';
    return;
  }

  alertsList.innerHTML = alerts.map(alert =>
    `<li class="alert-item ${alert.type}">${alert.message}</li>`
  ).join('');
}

function generateAlerts() {
  const alerts = [];
  const totalCU = calculateTotalCU();

  // Check graduation progress
  if (totalCU < PROGRAM_RULES.graduationMinimum) {
    const needed = (PROGRAM_RULES.graduationMinimum - totalCU).toFixed(1);
    alerts.push({
      type: 'warning',
      message: `You need ${needed} more CU to reach the graduation minimum of 19.0 CU`
    });
  }

  // Check finance decision for PHL/SF
  if (state.selectedCohort !== 'global' && !state.financeChoice) {
    alerts.push({
      type: 'warning',
      message: 'Make your Term 3 Corporate Finance decision above'
    });
  }

  // Check finance major requirements
  if (state.targetMajors.includes('finance') && state.financeChoice === 'FNCE-6210') {
    alerts.push({
      type: 'error',
      message: 'Finance major requires FNCE 6110. Change your Term 3 decision or remove Finance major.'
    });
  }

  // Check major progress
  state.targetMajors.forEach(majorId => {
    const major = MAJORS[majorId];
    const progress = calculateMajorProgress(majorId);
    if (progress.completed < major.requiredCUs) {
      const needed = (major.requiredCUs - progress.completed).toFixed(1);
      alerts.push({
        type: 'info',
        message: `${major.name} major: Need ${needed} more CU to complete`
      });
    }

    if (majorId === 'marketing_operations' && progress.details) {
      const details = progress.details;
      if (!details.marketingCore.hasRequiredCourse) {
        alerts.push({
          type: 'warning',
          message: 'M&O major: Marketing core requires MKTG 6110'
        });
      }
      if (!details.marketingCore.hasOptionCourse) {
        alerts.push({
          type: 'warning',
          message: 'M&O major: Complete MKTG 6120 or MKTG 6130 for the marketing core'
        });
      }
      if (details.oiddCore.credits < details.oiddCore.required) {
        const needed = (details.oiddCore.required - details.oiddCore.credits).toFixed(1);
        alerts.push({
          type: 'warning',
          message: `M&O major: Need ${needed} more CU from OIDD core (flex-core list)`
        });
      }
      if (!details.research.met) {
        alerts.push({
          type: 'warning',
          message: 'M&O major: Add a Marketing research course (e.g., MKTG 7120 or MKTG 7760)'
        });
      }
      if (details.electives.credits < details.electives.required) {
        const needed = (details.electives.required - details.electives.credits).toFixed(1);
        alerts.push({
          type: 'info',
          message: `M&O major: Need ${needed} more elective CU from MKTG/OIDD`
        });
      }
      const mktgNeeded = Math.max(0, 1.0 - details.electives.deptCredits.MKTG);
      if (mktgNeeded > 0) {
        alerts.push({
          type: 'info',
          message: `M&O major: Need ${mktgNeeded.toFixed(1)} more MKTG elective CU`
        });
      }
      const oiddNeeded = Math.max(0, 2.0 - details.electives.deptCredits.OIDD);
      if (oiddNeeded > 0) {
        alerts.push({
          type: 'info',
          message: `M&O major: Need ${oiddNeeded.toFixed(1)} more OIDD elective CU`
        });
      }
    }
  });

  // Check if exceeding max CU
  if (totalCU > PROGRAM_RULES.maximumWithoutExtraTuition) {
    const excess = (totalCU - PROGRAM_RULES.maximumWithoutExtraTuition).toFixed(1);
    alerts.push({
      type: 'warning',
      message: `Your plan exceeds 22.0 CU by ${excess}. Additional tuition may apply.`
    });
  }

  // Check for schedule conflicts
  const conflicts = getScheduleConflicts();
  conflicts.forEach(conflict => {
    alerts.push({
      type: 'warning',
      message: `Schedule conflict: ${conflict.course1} and ${conflict.course2} overlap on weekend ${conflict.weekend + 1} in ${conflict.term}`
    });
  });

  // Check for missing prerequisites
  const prereqWarnings = getMissingPrerequisites();
  prereqWarnings.forEach(warning => {
    alerts.push({
      type: 'warning',
      message: `${warning.course} requires ${warning.missing.join(', ')} which ${warning.missing.length > 1 ? 'are' : 'is'} not in your plan`
    });
  });

  return alerts;
}

// Schedule conflict detection
// Slots represent time slots within weekends: A, B, C for half-term courses, A,A or B,B for full-term courses
// Courses in different slots can be taken together even if they meet on the same weekends
function slotsConflict(slot1, slot2) {
  if (!slot1 || !slot2) return true; // If no slot info, fall back to weekend-based detection

  // Normalize slots for comparison (e.g., 'A,A' -> ['A'], 'A' -> ['A'])
  const getSlotBases = (slot) => {
    const parts = slot.split(',').map(s => s.trim());
    return [...new Set(parts)]; // Unique base slots
  };

  const bases1 = getSlotBases(slot1);
  const bases2 = getSlotBases(slot2);

  // Courses conflict if they share any base slot letter
  return bases1.some(b1 => bases2.includes(b1));
}

function getScheduleConflicts() {
  const conflicts = [];
  const cohort = state.selectedCohort;

  // Group planned courses by term
  const coursesByTerm = {};
  state.plannedCourses.forEach(code => {
    const normalizedCode = code.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (!course) return;

    const offering = course.offerings[cohort];
    if (!offering) return;

    const term = offering.term;
    if (!coursesByTerm[term]) coursesByTerm[term] = [];
    coursesByTerm[term].push({ code: normalizedCode, course, offering });
  });

  // Check for conflicts within each term
  Object.entries(coursesByTerm).forEach(([term, courses]) => {
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        const c1 = courses[i];
        const c2 = courses[j];

        // Check for GMC date conflicts (both have category: 'GMC' and same dates)
        if (c1.offering.category === 'GMC' && c2.offering.category === 'GMC') {
          if (c1.offering.dates && c2.offering.dates && c1.offering.dates === c2.offering.dates) {
            conflicts.push({
              course1: c1.course.code.replace('-', ' '),
              course2: c2.course.code.replace('-', ' '),
              term: SCHEDULE[cohort][term]?.name || term,
              weekend: c1.offering.dates + ' (GMC)'
            });
          }
          continue; // GMC courses don't conflict with regular weekend courses
        }

        // Skip if either is a GMC course (they don't conflict with regular courses)
        if (c1.offering.category === 'GMC' || c2.offering.category === 'GMC') {
          continue;
        }

        // Check slot-based conflicts first (if slot info available)
        const slot1 = c1.offering.slot;
        const slot2 = c2.offering.slot;

        // If both have slot info, use slot-based conflict detection
        if (slot1 && slot2) {
          if (slotsConflict(slot1, slot2)) {
            // Slots conflict - report the first overlapping weekend for display
            const weekends1 = c1.offering.weekends || [];
            const weekends2 = c2.offering.weekends || [];
            const overlap = weekends1.filter(w => weekends2.includes(w));

            conflicts.push({
              course1: c1.course.code.replace('-', ' '),
              course2: c2.course.code.replace('-', ' '),
              term: SCHEDULE[cohort][term]?.name || term,
              weekend: overlap.length > 0 ? overlap[0] : 0
            });
          }
          // Different slots = no conflict, even if weekends overlap
          continue;
        }

        // Fallback to weekend-based detection if slot info is missing
        const weekends1 = c1.offering.weekends || [];
        const weekends2 = c2.offering.weekends || [];

        // Find overlapping weekends
        const overlap = weekends1.filter(w => weekends2.includes(w));

        if (overlap.length > 0) {
          conflicts.push({
            course1: c1.course.code.replace('-', ' '),
            course2: c2.course.code.replace('-', ' '),
            term: SCHEDULE[cohort][term]?.name || term,
            weekend: overlap[0]
          });
        }
      }
    }
  });

  return conflicts;
}

// Prerequisites validation
function getMissingPrerequisites() {
  const warnings = [];
  const cohort = state.selectedCohort;

  // Get all courses in plan (including core curriculum)
  const coursesInPlan = new Set(state.plannedCourses.map(c => c.replace(/\s+/g, '-')));

  // Add core curriculum courses
  const coreCurriculum = CORE_CURRICULUM[cohort];
  ['T1', 'T2', 'T3'].forEach(term => {
    (coreCurriculum[term] || []).forEach(c => {
      coursesInPlan.add(c.code);
    });
  });

  // Handle finance choice
  if (cohort !== 'global') {
    if (state.financeChoice === 'FNCE-6110') {
      coursesInPlan.add('FNCE-6110');
      coursesInPlan.delete('FNCE-6210');
    } else {
      coursesInPlan.add('FNCE-6210');
    }
  } else {
    coursesInPlan.add('FNCE-6110');
  }

  // Check each planned elective for prerequisites
  state.plannedCourses.forEach(code => {
    const normalizedCode = code.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (!course || !course.prerequisites || course.prerequisites.length === 0) return;

    const missing = course.prerequisites.filter(prereq => !coursesInPlan.has(prereq));

    if (missing.length > 0) {
      warnings.push({
        course: course.code.replace('-', ' '),
        missing: missing.map(p => {
          const prereqCourse = COURSES[p];
          return prereqCourse ? prereqCourse.code.replace('-', ' ') : p.replace('-', ' ');
        })
      });
    }
  });

  return warnings;
}

// Explorer
function setBrowseMode(mode) {
  state.explorerMode = mode;

  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.browse === mode);
  });

  document.getElementById('majors-list').classList.toggle('hidden', mode !== 'majors');
  document.getElementById('departments-list').classList.toggle('hidden', mode !== 'departments');

  // Clear selection
  state.selectedMajor = null;
  state.selectedDepartment = null;
  clearExplorerContent();
}

function populateSidebar() {
  // Populate majors
  const majorsList = document.getElementById('majors-list');
  majorsList.innerHTML = Object.values(MAJORS).map(major => `
    <li class="sidebar-item" data-major="${major.id}">
      <span>${major.name}</span>
      <span class="badge">${major.requiredCUs} CU</span>
    </li>
  `).join('');

  majorsList.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => selectMajor(item.dataset.major));
  });

  // Populate departments
  const deptsList = document.getElementById('departments-list');
  deptsList.innerHTML = Object.entries(DEPARTMENTS).map(([code, dept]) => {
    const count = getCoursesForDepartment(code).length;
    return `
      <li class="sidebar-item" data-dept="${code}">
        <span>${dept.name}</span>
        <span class="badge">${count}</span>
      </li>
    `;
  }).join('');

  deptsList.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => selectDepartment(item.dataset.dept));
  });
}

function selectMajor(majorId) {
  state.selectedMajor = majorId;
  state.selectedDepartment = null;

  // Update sidebar selection
  document.querySelectorAll('#majors-list .sidebar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.major === majorId);
  });

  const major = MAJORS[majorId];

  // Update header
  document.getElementById('explorer-title').textContent = major.name;
  document.getElementById('explorer-subtitle').textContent =
    `${major.requiredCUs} CU required | ${major.stemCertified ? 'STEM Certified' : 'Not STEM'} | ${major.description}`;

  // Show courses for this major
  displayMajorCourses(majorId);
}

function selectDepartment(deptCode) {
  state.selectedDepartment = deptCode;
  state.selectedMajor = null;

  // Update sidebar selection
  document.querySelectorAll('#departments-list .sidebar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.dept === deptCode);
  });

  const dept = DEPARTMENTS[deptCode];

  // Update header
  document.getElementById('explorer-title').textContent = dept.name;
  document.getElementById('explorer-subtitle').textContent =
    `All ${deptCode} courses available for your cohort`;

  // Show courses for this department
  displayDepartmentCourses(deptCode);
}

function displayMajorCourses(majorId) {
  const major = MAJORS[majorId];
  const container = document.getElementById('explorer-courses');

  // Get relevant courses
  const courses = major.electiveCourses || [];
  const availableCourses = courses
    .map(code => ({ code, ...COURSES[code] }))
    .filter(course => course && course.offerings && course.offerings[state.selectedCohort]);

  if (availableCourses.length === 0) {
    container.innerHTML = '<p class="empty-state">No courses available for this major in your cohort.</p>';
    return;
  }

  container.innerHTML = availableCourses.map(course => createCourseCard(course)).join('');
  attachCourseListeners();

  // Add "Set as target major" button
  const isTargeted = state.targetMajors.includes(majorId);
  const majorBtn = `
    <div style="grid-column: 1 / -1; margin-bottom: 1rem;">
      <button class="btn-${isTargeted ? 'secondary' : 'primary'}" onclick="toggleTargetMajor('${majorId}')">
        ${isTargeted ? 'Remove from Target Majors' : 'Set as Target Major'}
      </button>
      ${major.warnings.length > 0 ? `
        <div class="alert-item warning" style="margin-top: 0.5rem;">
          ${major.warnings.join('<br>')}
        </div>
      ` : ''}
    </div>
  `;
  container.insertAdjacentHTML('afterbegin', majorBtn);

  // Apply major highlights
  applyMajorHighlights();
}

function displayDepartmentCourses(deptCode) {
  const courses = getCoursesForDepartment(deptCode);
  const container = document.getElementById('explorer-courses');

  if (courses.length === 0) {
    container.innerHTML = '<p class="empty-state">No courses available for this department in your cohort.</p>';
    return;
  }

  container.innerHTML = courses.map(course => createCourseCard(course)).join('');
  attachCourseListeners();

  // Apply major highlights
  applyMajorHighlights();
}

function getCoursesForDepartment(deptCode) {
  return Object.entries(COURSES)
    .filter(([code, course]) => {
      return course.department === deptCode &&
             course.offerings &&
             course.offerings[state.selectedCohort];
    })
    .map(([code, course]) => ({ code, ...course }));
}

function createCourseCard(course) {
  const offering = course.offerings[state.selectedCohort];
  // Check both hyphen and space formats for backwards compatibility
  const normalizedCode = course.code.replace(/\s+/g, '-');
  const inPlan = state.plannedCourses.some(c => c.replace(/\s+/g, '-') === normalizedCode);
  const termLabel = getTermLabel(offering);
  const evaluations = offering.evaluations || null;

  return `
    <div class="course-card ${inPlan ? 'in-plan' : ''}" data-course="${course.code}">
      <div class="course-header">
        <span class="course-code dept-${course.department}">${course.code.replace('-', ' ')}</span>
        <span class="course-credits">${course.credits} CU</span>
      </div>
      <div class="course-title">${course.title}</div>
      <div class="course-meta">
        ${termLabel} | ${offering.professor}
        ${offering.dates ? `<br>${offering.dates}` : ''}
        ${offering.location ? ` | ${offering.location}` : ''}
      </div>
      ${createMiniEvalChart(evaluations)}
      <div class="course-actions">
        ${inPlan ?
          `<button class="course-btn remove" onclick="removeCourse('${course.code}')">Remove</button>` :
          `<button class="course-btn add" onclick="addCourse('${course.code}')">Add to Plan</button>`
        }
        <button class="course-btn details" onclick="showCourseDetails('${course.code}')">Details</button>
      </div>
    </div>
  `;
}

function attachCourseListeners() {
  // Additional listeners if needed
}

function clearExplorerContent() {
  document.getElementById('explorer-title').textContent = 'Select a Major or Department';
  document.getElementById('explorer-subtitle').textContent = 'Browse courses and add them to your plan';
  document.getElementById('explorer-courses').innerHTML =
    '<p class="empty-state">Select a major or department from the sidebar to view available courses.</p>';
}

function filterCourses(query) {
  if (!query) {
    // Re-display current selection
    if (state.selectedMajor) {
      displayMajorCourses(state.selectedMajor);
    } else if (state.selectedDepartment) {
      displayDepartmentCourses(state.selectedDepartment);
    }
    return;
  }

  query = query.toLowerCase();

  // Search all courses
  const results = Object.entries(COURSES)
    .filter(([code, course]) => {
      const matchesQuery = code.toLowerCase().includes(query) ||
                          course.title.toLowerCase().includes(query);
      const availableForCohort = course.offerings && course.offerings[state.selectedCohort];
      return matchesQuery && availableForCohort;
    })
    .map(([code, course]) => ({ code, ...course }));

  const container = document.getElementById('explorer-courses');

  if (results.length === 0) {
    container.innerHTML = '<p class="empty-state">No courses found matching your search.</p>';
    return;
  }

  document.getElementById('explorer-title').textContent = `Search Results`;
  document.getElementById('explorer-subtitle').textContent = `${results.length} courses found for "${query}"`;
  container.innerHTML = results.map(course => createCourseCard(course)).join('');

  // Apply major highlights
  applyMajorHighlights();
}

// Course Management
function addCourse(courseCode) {
  // Normalize course code to use hyphens (e.g., 'FNCE 7320' -> 'FNCE-7320')
  const normalizedCode = courseCode.replace(/\s+/g, '-');
  if (!state.plannedCourses.includes(normalizedCode)) {
    state.plannedCourses.push(normalizedCode);
    saveState();

    // Update all credit displays across all views instantly
    updateAllCreditDisplays();

    // Refresh view-specific content
    updateDashboard();
    updatePathway();

    // Update graph view if active
    if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
      renderGraphView();
    }

    // Refresh explorer if visible
    if (state.selectedMajor) {
      displayMajorCourses(state.selectedMajor);
    } else if (state.selectedDepartment) {
      displayDepartmentCourses(state.selectedDepartment);
    }
  }
}

function removeCourse(courseCode) {
  // Normalize course code to use hyphens
  const normalizedCode = courseCode.replace(/\s+/g, '-');
  state.plannedCourses = state.plannedCourses.filter(c => c !== normalizedCode);
  saveState();

  // Update all credit displays across all views instantly
  updateAllCreditDisplays();

  // Refresh view-specific content
  updateDashboard();
  updatePathway();

  // Update graph view if active
  if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
    renderGraphView();
  }

  // Refresh explorer if visible
  if (state.selectedMajor) {
    displayMajorCourses(state.selectedMajor);
  } else if (state.selectedDepartment) {
    displayDepartmentCourses(state.selectedDepartment);
  }
}

// Early Block Courses Management
function getEarlyBlockCoursesForCohort(cohort) {
  return Object.entries(EARLY_BLOCK_COURSES)
    .filter(([code, course]) => course.cohorts.includes(cohort))
    .map(([code, course]) => ({ code, ...course }));
}

function getEarlyBlockCoursesForTerm(term) {
  const cohort = state.selectedCohort;
  return Object.entries(EARLY_BLOCK_COURSES)
    .filter(([code, course]) => course.term === term && course.cohorts.includes(cohort))
    .map(([code, course]) => ({ code, ...course }));
}

function toggleCompletedBlockCourse(courseCode) {
  if (state.completedBlockCourses.includes(courseCode)) {
    state.completedBlockCourses = state.completedBlockCourses.filter(c => c !== courseCode);
  } else {
    state.completedBlockCourses.push(courseCode);
  }
  saveState();

  // Update all credit displays across all views instantly
  updateAllCreditDisplays();

  // Refresh view-specific content
  updateDashboard();
  updatePathway();

  // Update graph view if active
  if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
    renderGraphView();
  }
}

function getCompletedBlockCoursesCU() {
  return state.completedBlockCourses.reduce((total, code) => {
    // Normalize to hyphen format for EARLY_BLOCK_COURSES lookup
    const normalizedCode = code.replace(/\s+/g, '-');
    const course = EARLY_BLOCK_COURSES[normalizedCode];
    return total + (course ? course.credits : 0);
  }, 0);
}

function toggleTargetMajor(majorId) {
  if (state.targetMajors.includes(majorId)) {
    state.targetMajors = state.targetMajors.filter(m => m !== majorId);
  } else {
    state.targetMajors.push(majorId);
  }

  // Update highlighted courses list
  updateMajorHighlights();

  saveState();

  updateDashboard();
  if (state.selectedMajor === majorId) {
    displayMajorCourses(majorId);
  }

  // Apply highlights to all views
  applyMajorHighlights();

  // Update graph view if active
  if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
    renderGraphView();
  }
}

// Update the list of courses to highlight based on target majors
function updateMajorHighlights() {
  const highlightedCourses = new Set();

  state.targetMajors.forEach(majorId => {
    const major = MAJORS[majorId];
    if (!major) return;

    // Add required/core courses
    if (major.coreRequirements) {
      major.coreRequirements.forEach(code => highlightedCourses.add(code));
    }

    // Add primary courses
    if (major.primaryCourses) {
      major.primaryCourses.forEach(code => highlightedCourses.add(code));
    }

    // Add secondary courses
    if (major.secondaryCourses) {
      major.secondaryCourses.forEach(code => highlightedCourses.add(code));
    }

    // Add elective courses
    if (major.electiveCourses) {
      major.electiveCourses.forEach(code => highlightedCourses.add(code));
    }
  });

  state.highlightedMajorCourses = Array.from(highlightedCourses);
}

// Apply visual highlights across all views
function applyMajorHighlights() {
  const highlightSet = new Set(state.highlightedMajorCourses);

  // Highlight courses in Explorer view
  document.querySelectorAll('#explorer-courses .course-card').forEach(card => {
    const courseCode = card.dataset.course?.replace(/\s+/g, '-');
    if (highlightSet.has(courseCode)) {
      card.classList.add('major-highlight');
    } else {
      card.classList.remove('major-highlight');
    }
  });

  // Highlight courses in Pathway view (term cards)
  document.querySelectorAll('.term-courses li').forEach(item => {
    const courseNameEl = item.querySelector('.course-name');
    if (courseNameEl) {
      const courseName = courseNameEl.textContent;
      // Extract course code from "CODE: Title" format
      const codeMatch = courseName.match(/^([A-Z]{3,4})\s+(\d{4})/);
      if (codeMatch) {
        const courseCode = `${codeMatch[1]}-${codeMatch[2]}`;
        if (highlightSet.has(courseCode)) {
          item.classList.add('major-highlight');
        } else {
          item.classList.remove('major-highlight');
        }
      }
    }
  });

  // Graph view highlighting is handled by pathway-graph.js
}

// Pathway
function updatePathway() {
  const cohort = state.selectedCohort;
  const coreCurriculum = CORE_CURRICULUM[cohort];

  // Update Terms 1-3 (core + early block courses)
  ['T1', 'T2', 'T3'].forEach(term => {
    const courses = coreCurriculum[term] || [];
    const coursesList = document.getElementById(`${term}-courses`);
    const cuDisplay = document.getElementById(`${term}-cu`);

    let termCourses = [...courses];

    // Handle Term 3 finance choice
    if (term === 'T3' && cohort !== 'global') {
      if (state.financeChoice === 'FNCE-6110') {
        // Replace FNCE-6210 with FNCE-6110
        termCourses = termCourses.filter(c => c.code !== 'FNCE-6210');
        const altCourse = coreCurriculum.T3_alternative?.find(c => c.code === 'FNCE-6110');
        if (altCourse) {
          termCourses.unshift(altCourse);
        }
      }
    }

    // Get early block courses for this term
    const earlyBlockCourses = getEarlyBlockCoursesForTerm(term);
    const completedBlockInTerm = earlyBlockCourses.filter(c => state.completedBlockCourses.includes(c.code));

    // Calculate total CU including completed block courses
    const coreCU = termCourses.reduce((sum, c) => sum + c.credits, 0);
    const blockCU = completedBlockInTerm.reduce((sum, c) => sum + c.credits, 0);
    const totalCU = coreCU + blockCU;
    cuDisplay.textContent = `${totalCU.toFixed(1)} CU`;

    // Render core courses
    let html = termCourses.map(course => `
      <li>
        <span class="course-name">${course.code.replace('-', ' ')}: ${course.title}</span>
        <span class="course-cu">${course.credits} CU</span>
      </li>
    `).join('');

    // Add early block courses section if any are available for this term
    if (earlyBlockCourses.length > 0) {
      html += `<li class="block-courses-divider"><span>Block Courses</span></li>`;
      earlyBlockCourses.forEach(course => {
        const isCompleted = state.completedBlockCourses.includes(course.code);
        html += `
          <li class="block-course-row ${isCompleted ? 'completed' : ''}">
            <span class="course-name">${course.title}</span>
            <button class="block-add-btn ${isCompleted ? 'added' : ''}"
                    onclick="toggleCompletedBlockCourse('${course.code}')">
              ${isCompleted ? '✓' : '+'}
            </button>
          </li>
        `;
      });
    }

    coursesList.innerHTML = html;
  });

  // Update Terms 4-6 and Block Weeks (electives)
  ['T4', 'T5', 'T6', 'BW'].forEach(term => {
    const courses = getPlannedCoursesForTerm(term);
    const coursesList = document.getElementById(`${term}-courses`);
    const cuDisplay = document.getElementById(`${term}-cu`);

    const totalCU = courses.reduce((sum, c) => sum + c.credits, 0);
    cuDisplay.textContent = `${totalCU.toFixed(1)} CU`;

    if (courses.length === 0) {
      coursesList.innerHTML = `<li class="empty-slot">No courses planned</li>`;
    } else {
      coursesList.innerHTML = courses.map(course => `
        <li>
          <span class="course-name">${course.code.replace('-', ' ')}: ${course.title}</span>
          <span class="course-cu">${course.credits} CU</span>
          <button class="remove-btn" onclick="removeCourse('${course.code}')">&times;</button>
        </li>
      `).join('');
    }
  });

  // Update pathway stats
  const totalCU = calculateTotalCU();
  document.getElementById('pathway-total-cu').textContent = totalCU.toFixed(1);
  document.getElementById('pathway-status').textContent =
    totalCU >= PROGRAM_RULES.graduationMinimum ? 'Ready' : 'In Progress';
  document.getElementById('pathway-majors').textContent =
    state.targetMajors.length > 0
      ? state.targetMajors.map(m => MAJORS[m].name).join(', ')
      : 'None';

  // Update validation messages
  updateValidation();

  // Apply major highlights to pathway courses
  applyMajorHighlights();
}

function getPlannedCoursesForTerm(term) {
  return state.plannedCourses
    .map(code => {
      // Normalize to hyphen format for COURSES lookup
      const normalizedCode = code.replace(/\s+/g, '-');
      const course = COURSES[normalizedCode];
      if (!course) return null;
      const offering = course.offerings[state.selectedCohort];
      if (!offering || offering.term !== term) return null;
      return { code: normalizedCode, ...course };
    })
    .filter(c => c !== null);
}

function updateValidation() {
  const container = document.getElementById('validation-messages');
  const messages = [];

  const totalCU = calculateTotalCU();

  // Graduation check
  if (totalCU >= PROGRAM_RULES.graduationMinimum) {
    messages.push({
      type: 'success',
      text: `Your plan totals ${totalCU.toFixed(1)} CU - meets graduation requirement!`
    });
  } else {
    messages.push({
      type: 'warning',
      text: `Your plan needs ${(PROGRAM_RULES.graduationMinimum - totalCU).toFixed(1)} more CU to meet the 19.0 CU graduation requirement`
    });
  }

  // Major completion check
  state.targetMajors.forEach(majorId => {
    const major = MAJORS[majorId];
    const progress = calculateMajorProgress(majorId);
    if (progress.completed >= major.requiredCUs) {
      messages.push({
        type: 'success',
        text: `${major.name} major requirements complete!`
      });
    } else {
      messages.push({
        type: 'warning',
        text: `${major.name} major: ${(major.requiredCUs - progress.completed).toFixed(1)} CU remaining`
      });
    }
  });

  // Finance major warning
  if (state.targetMajors.includes('finance') && state.financeChoice === 'FNCE-6210') {
    messages.push({
      type: 'error',
      text: 'Cannot complete Finance major with FNCE 6210. Change to FNCE 6110 in Term 3.'
    });
  }

  container.innerHTML = messages.map(m => `
    <div class="validation-message ${m.type}">
      ${m.type === 'success' ? '&#10003;' : m.type === 'error' ? '&#10007;' : '&#9888;'}
      ${m.text}
    </div>
  `).join('');
}

// Add Course Modal
function addCourseToTerm(term) {
  const modal = document.getElementById('add-course-modal');
  const title = document.getElementById('add-course-title');
  const list = document.getElementById('add-course-list');

  const termLabel = term === 'BW' ? 'Block Week' : `Term ${term.slice(1)}`;
  title.textContent = `Add Course to ${termLabel}`;

  // Get available courses for this term
  const availableCourses = Object.entries(COURSES)
    .filter(([code, course]) => {
      const offering = course.offerings && course.offerings[state.selectedCohort];
      return offering && offering.term === term && !state.plannedCourses.includes(code);
    })
    .map(([code, course]) => ({ code, ...course }));

  if (availableCourses.length === 0) {
    list.innerHTML = '<p class="empty-state">No more courses available for this term.</p>';
  } else {
    list.innerHTML = availableCourses.map(course => {
      const offering = course.offerings[state.selectedCohort];
      return `
        <div class="add-course-item" onclick="addCourseAndClose('${course.code}')">
          <div class="add-course-info">
            <h4>${course.code.replace('-', ' ')}: ${course.title}</h4>
            <p>${course.credits} CU | ${offering.professor}${offering.dates ? ` | ${offering.dates}` : ''}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  modal.classList.remove('hidden');
}

function addCourseAndClose(courseCode) {
  addCourse(courseCode);
  closeAddCourseModal();
}

function closeAddCourseModal() {
  document.getElementById('add-course-modal').classList.add('hidden');
}

// Course Details Modal
function showCourseDetails(courseCode) {
  const normalizedCode = courseCode.replace(/\s+/g, '-');
  const course = COURSES[normalizedCode];
  const offering = course.offerings[state.selectedCohort];
  const modal = document.getElementById('course-modal');
  const body = document.getElementById('modal-body');

  const inPlan = state.plannedCourses.includes(normalizedCode);
  const termLabel = getTermLabel(offering);
  const evaluations = offering.evaluations || null;

  // Find which majors this course applies to
  const applicableMajors = Object.entries(MAJORS)
    .filter(([id, major]) =>
      major.electiveCourses?.includes(normalizedCode) ||
      major.primaryCourses?.includes(normalizedCode) ||
      major.secondaryCourses?.includes(normalizedCode)
    )
    .map(([id, major]) => major.name);

  // Check prerequisites
  const prereqInfo = getPrerequisiteInfo(normalizedCode);

  body.innerHTML = `
    <h2 class="dept-${course.department}">${course.code.replace('-', ' ')}</h2>
    <h3>${course.title}</h3>

    ${course.description ? `
      <p style="margin: 1rem 0; color: var(--text-secondary); line-height: 1.5;">${course.description}</p>
    ` : ''}

    <div style="margin: 1.5rem 0;">
      <p><strong>Credits:</strong> ${course.credits} CU</p>
      <p><strong>Department:</strong> ${DEPARTMENTS[course.department].name}</p>
      <p><strong>Term:</strong> ${termLabel}</p>
      <p><strong>Professor:</strong> ${offering.professor}</p>
      ${offering.dates ? `<p><strong>Dates:</strong> ${offering.dates}</p>` : ''}
      ${offering.location ? `<p><strong>Location:</strong> ${offering.location}</p>` : ''}
    </div>

    ${prereqInfo.prerequisites.length > 0 ? `
      <div style="margin: 1rem 0; padding: 1rem; background: ${prereqInfo.missingPrereqs.length > 0 ? 'var(--warning-bg, #fef3cd)' : 'var(--background)'}; border-radius: var(--radius); ${prereqInfo.missingPrereqs.length > 0 ? 'border: 1px solid var(--warning-border, #ffc107);' : ''}">
        <strong>Prerequisites:</strong> ${prereqInfo.prerequisites.join(', ')}
        ${prereqInfo.missingPrereqs.length > 0 ? `
          <p style="margin-top: 0.5rem; color: var(--warning-text, #856404); font-size: 0.875rem;">
            Missing: ${prereqInfo.missingPrereqs.join(', ')}
          </p>
        ` : ''}
      </div>
    ` : ''}

    ${applicableMajors.length > 0 ? `
      <div style="margin: 1rem 0; padding: 1rem; background: var(--background); border-radius: var(--radius);">
        <strong>Counts toward:</strong> ${applicableMajors.join(', ')}
      </div>
    ` : ''}

    ${createFullEvalSection(evaluations, offering.professor)}

    <div style="margin-top: 1.5rem;">
      ${inPlan ?
        `<button class="btn-secondary" onclick="removeCourse('${normalizedCode}'); closeModal();" style="width: 100%;">Remove from Plan</button>` :
        `<button class="btn-primary" onclick="addCourse('${normalizedCode}'); closeModal();" style="width: 100%;">Add to Plan</button>`
      }
    </div>
  `;

  modal.classList.remove('hidden');
}

// Get prerequisite information for a course
function getPrerequisiteInfo(courseCode) {
  const normalizedCode = courseCode.replace(/\s+/g, '-');
  const course = COURSES[normalizedCode];
  const cohort = state.selectedCohort;

  if (!course || !course.prerequisites || course.prerequisites.length === 0) {
    return { prerequisites: [], missingPrereqs: [] };
  }

  // Get all courses in plan (including core curriculum)
  const coursesInPlan = new Set(state.plannedCourses.map(c => c.replace(/\s+/g, '-')));

  // Add core curriculum courses
  const coreCurriculum = CORE_CURRICULUM[cohort];
  ['T1', 'T2', 'T3'].forEach(term => {
    (coreCurriculum[term] || []).forEach(c => {
      coursesInPlan.add(c.code);
    });
  });

  // Handle finance choice
  if (cohort !== 'global') {
    if (state.financeChoice === 'FNCE-6110') {
      coursesInPlan.add('FNCE-6110');
      coursesInPlan.delete('FNCE-6210');
    } else {
      coursesInPlan.add('FNCE-6210');
    }
  } else {
    coursesInPlan.add('FNCE-6110');
  }

  const prerequisites = course.prerequisites.map(p => {
    const prereqCourse = COURSES[p];
    // Check if it's a core course
    let isCore = false;
    ['T1', 'T2', 'T3'].forEach(term => {
      if ((coreCurriculum[term] || []).some(c => c.code === p)) {
        isCore = true;
      }
    });
    if (p === 'FNCE-6110' || p === 'FNCE-6210') isCore = true;

    return prereqCourse ? prereqCourse.code.replace('-', ' ') : p.replace('-', ' ');
  });

  const missingPrereqs = course.prerequisites
    .filter(prereq => !coursesInPlan.has(prereq))
    .map(p => {
      const prereqCourse = COURSES[p];
      return prereqCourse ? prereqCourse.code.replace('-', ' ') : p.replace('-', ' ');
    });

  return { prerequisites, missingPrereqs };
}

function closeModal() {
  document.getElementById('course-modal').classList.add('hidden');
}

// Calculations
function calculateTotalCU() {
  const cohort = state.selectedCohort;
  const core = CORE_CURRICULUM[cohort];

  // Core curriculum CUs
  let total = 0;
  ['T1', 'T2', 'T3'].forEach(term => {
    const courses = core[term] || [];
    courses.forEach(c => {
      // Handle Term 3 finance choice
      if (c.code === 'FNCE-6210' && state.financeChoice === 'FNCE-6110' && cohort !== 'global') {
        // Skip the 0.5 CU version
        return;
      }
      total += c.credits;
    });
  });

  // Add FNCE-6110 if selected (for PHL/SF)
  if (cohort !== 'global' && state.financeChoice === 'FNCE-6110') {
    total += 1.0; // Add full 1.0 CU for FNCE-6110 (we skipped FNCE-6210's 0.5 CU above)
  }

  // Completed early block courses (T1-T3 supplemental)
  state.completedBlockCourses.forEach(code => {
    // Normalize to hyphen format for EARLY_BLOCK_COURSES lookup
    const normalizedCode = code.replace(/\s+/g, '-');
    const course = EARLY_BLOCK_COURSES[normalizedCode];
    if (course) {
      total += course.credits;
    }
  });

  // Elective CUs
  state.plannedCourses.forEach(code => {
    // Normalize to hyphen format for COURSES lookup
    const normalizedCode = code.replace(/\s+/g, '-');
    const course = COURSES[normalizedCode];
    if (course) {
      total += course.credits;
    }
  });

  return total;
}

// Update all credit unit displays across all views (for real-time sync)
function updateAllCreditDisplays() {
  const totalCU = calculateTotalCU();
  const progress = (totalCU / PROGRAM_RULES.graduationMinimum) * 100;

  // Banner header Plan Total
  const totalCuEl = document.getElementById('total-cu');
  if (totalCuEl) totalCuEl.textContent = totalCU.toFixed(1);

  // Dashboard progress
  const progressCuEl = document.getElementById('progress-cu');
  if (progressCuEl) progressCuEl.textContent = totalCU.toFixed(1);

  const progressBarEl = document.getElementById('progress-bar');
  if (progressBarEl) progressBarEl.style.width = `${Math.min(progress, 100)}%`;

  const progressPercentEl = document.getElementById('progress-percent');
  if (progressPercentEl) progressPercentEl.textContent = `(${Math.round(progress)}%)`;

  // Pathway view stats
  const pathwayCuEl = document.getElementById('pathway-total-cu');
  if (pathwayCuEl) pathwayCuEl.textContent = totalCU.toFixed(1);

  const pathwayStatusEl = document.getElementById('pathway-status');
  if (pathwayStatusEl) {
    pathwayStatusEl.textContent = totalCU >= PROGRAM_RULES.graduationMinimum ? 'Ready' : 'In Progress';
  }

  // Graph Builder stats
  const graphCuEl = document.getElementById('graph-total-cu');
  if (graphCuEl) graphCuEl.textContent = totalCU.toFixed(1);

  // Graduation status badge
  const statusEl = document.getElementById('graduation-status');
  if (statusEl) {
    if (totalCU >= PROGRAM_RULES.graduationMinimum) {
      statusEl.textContent = 'Graduation Ready';
      statusEl.className = 'status-badge ready';
    } else {
      const needed = (PROGRAM_RULES.graduationMinimum - totalCU).toFixed(1);
      statusEl.textContent = `Need ${needed} more CU`;
      statusEl.className = 'status-badge pending';
    }
  }
}

function normalizeCourseCode(code) {
  return code.replace(/\s+/g, '-');
}

function getCoreCourseCredits(code) {
  const cohortCore = CORE_CURRICULUM[state.selectedCohort];
  if (!cohortCore) return 0;

  if (code === 'FNCE-6110') {
    if (state.selectedCohort === 'global' || state.financeChoice === 'FNCE-6110') {
      return 1.0;
    }
    return 0;
  }

  const coreEntry = ['T1', 'T2', 'T3']
    .flatMap(term => cohortCore[term] || [])
    .find(c => c.code === code);

  return coreEntry ? coreEntry.credits : 0;
}

function getCoreOnlyCredits(code) {
  const cohortCore = CORE_CURRICULUM[state.selectedCohort];
  if (!cohortCore) return 0;

  if (code === 'FNCE-6110') {
    if (state.selectedCohort === 'global' || state.financeChoice === 'FNCE-6110') {
      return 1.0;
    }
    return 0;
  }

  const coreEntry = ['T1', 'T2', 'T3']
    .flatMap(term => cohortCore[term] || [])
    .find(c => c.code === code);

  return coreEntry ? coreEntry.credits : 0;
}

function getCourseCreditsIfTaken(code) {
  const normalizedCode = normalizeCourseCode(code);
  if (state.plannedCourses.includes(normalizedCode)) {
    const course = COURSES[normalizedCode];
    return course ? course.credits : 0;
  }
  // Check completed early block courses
  if (state.completedBlockCourses.includes(normalizedCode)) {
    const blockCourse = EARLY_BLOCK_COURSES[normalizedCode];
    return blockCourse ? blockCourse.credits : 0;
  }
  return getCoreCourseCredits(normalizedCode);
}

function calculateMarketingOperationsProgress() {
  const major = MAJORS.marketing_operations;
  const requirements = major.requirements;
  const details = {
    marketingCore: {
      credits: 0,
      required: requirements.marketingCore.requiredCredits,
      hasRequiredCourse: false,
      hasOptionCourse: false
    },
    oiddCore: { credits: 0, required: requirements.oiddCore.requiredCredits },
    research: { credits: 0, required: requirements.marketingResearch.requiredCredits, met: false },
    electives: { credits: 0, required: requirements.electives.requiredCredits, deptCredits: { MKTG: 0, OIDD: 0 } }
  };

  const hasMarketingCore = requirements.marketingCore.requiredCourses
    .some(code => getCourseCreditsIfTaken(code) > 0);
  if (hasMarketingCore) {
    details.marketingCore.credits += 0.5;
    details.marketingCore.hasRequiredCourse = true;
  }

  const hasMarketingOption = requirements.marketingCore.oneOfCourses
    .some(code => getCourseCreditsIfTaken(code) > 0);
  if (hasMarketingOption) {
    details.marketingCore.credits += 0.5;
    details.marketingCore.hasOptionCourse = true;
  }
  details.marketingCore.credits = Math.min(details.marketingCore.credits, details.marketingCore.required);

  requirements.oiddCore.courses.forEach(code => {
    details.oiddCore.credits += getCoreOnlyCredits(code);
  });
  details.oiddCore.credits = Math.min(details.oiddCore.credits, details.oiddCore.required);

  let researchCredits = 0;
  requirements.marketingResearch.pairedCourses.forEach(pair => {
    const hasPair = pair.every(code => getCourseCreditsIfTaken(code) > 0);
    if (hasPair) {
      researchCredits = Math.max(researchCredits, 1.0);
    }
  });

  if (researchCredits < requirements.marketingResearch.requiredCredits) {
    requirements.marketingResearch.oneOfCourses.forEach(code => {
      researchCredits += getCourseCreditsIfTaken(code);
    });
  }
  details.research.credits = Math.min(researchCredits, details.research.required);
  details.research.met = details.research.credits >= details.research.required;

  let plannedOiddCoreCredits = 0;
  const plannedElectiveCourses = [];

  state.plannedCourses.forEach(code => {
    const normalizedCode = normalizeCourseCode(code);
    const course = COURSES[normalizedCode];
    if (!course) return;
    const eligibleOutside = requirements.electives.eligibleOutsideDepartments || [];
    const deptOverrides = requirements.electives.deptOverrides || {};
    const isEligibleDepartment = requirements.electives.eligibleDepartments.includes(course.department);
    const isEligibleOutside = eligibleOutside.includes(normalizedCode);
    if (!isEligibleDepartment && !isEligibleOutside) return;

    plannedElectiveCourses.push({ code: normalizedCode, course });

    if (requirements.oiddCore.courses.includes(normalizedCode)) {
      plannedOiddCoreCredits += course.credits;
    }
  });

  // Also check completed early block courses
  state.completedBlockCourses.forEach(code => {
    // Normalize to hyphen format for EARLY_BLOCK_COURSES lookup
    const normalizedCode = code.replace(/\s+/g, '-');
    const blockCourse = EARLY_BLOCK_COURSES[normalizedCode];
    if (!blockCourse) return;
    const eligibleOutside = requirements.electives.eligibleOutsideDepartments || [];
    const isEligibleDepartment = requirements.electives.eligibleDepartments.includes(blockCourse.department);
    const isEligibleOutside = eligibleOutside.includes(normalizedCode);
    if (!isEligibleDepartment && !isEligibleOutside) return;

    plannedElectiveCourses.push({ code: normalizedCode, course: blockCourse });

    if (requirements.oiddCore.courses.includes(normalizedCode)) {
      plannedOiddCoreCredits += blockCourse.credits;
    }
  });

  const remainingOiddCore = Math.max(0, details.oiddCore.required - details.oiddCore.credits);
  const oiddCoreFromPlanned = Math.min(remainingOiddCore, plannedOiddCoreCredits);
  details.oiddCore.credits += oiddCoreFromPlanned;

  plannedElectiveCourses.forEach(({ code, course }) => {
    const isResearchCourse = requirements.marketingResearch.oneOfCourses.includes(code) ||
      requirements.marketingResearch.pairedCourses.flat().includes(code);
    if (isResearchCourse) return;

    details.electives.credits += course.credits;
    const deptOverrides = requirements.electives.deptOverrides || {};
    const eligibleOutside = requirements.electives.eligibleOutsideDepartments || [];
    const deptForCounting = deptOverrides[code] || course.department;
    if (!eligibleOutside.includes(code) && requirements.electives.eligibleDepartments.includes(deptForCounting)) {
      details.electives.deptCredits[deptForCounting] =
        (details.electives.deptCredits[deptForCounting] || 0) + course.credits;
    }
  });

  if (oiddCoreFromPlanned > 0) {
    details.electives.credits = Math.max(0, details.electives.credits - oiddCoreFromPlanned);
    details.electives.deptCredits.OIDD = Math.max(0, details.electives.deptCredits.OIDD - oiddCoreFromPlanned);
  }

  const completed = details.marketingCore.credits +
    details.oiddCore.credits +
    details.research.credits +
    Math.min(details.electives.credits, details.electives.required);

  return {
    completed: Math.min(completed, major.requiredCUs),
    required: major.requiredCUs,
    details
  };
}

function calculateMajorProgress(majorId) {
  if (majorId === 'marketing_operations') {
    return calculateMarketingOperationsProgress();
  }

  const major = MAJORS[majorId];
  let completed = 0;

  // Check core requirements
  const allCourses = [
    ...(major.coreRequirements || []),
    ...(major.electiveCourses || []),
    ...(major.primaryCourses || []),
    ...(major.secondaryCourses || [])
  ];

  // Check which planned courses count
  state.plannedCourses.forEach(code => {
    // Normalize to hyphen format
    const normalizedCode = code.replace(/\s+/g, '-');
    if (allCourses.includes(normalizedCode)) {
      const course = COURSES[normalizedCode];
      if (course) {
        completed += course.credits;
      }
    }
  });

  // Check completed early block courses that count toward this major
  state.completedBlockCourses.forEach(code => {
    // Normalize to hyphen format for EARLY_BLOCK_COURSES lookup
    const normalizedCode = code.replace(/\s+/g, '-');
    const blockCourse = EARLY_BLOCK_COURSES[normalizedCode];
    if (blockCourse && allCourses.includes(normalizedCode)) {
      completed += blockCourse.credits;
    }
  });

  // Check core curriculum courses that count
  if (major.coreRequirements) {
    major.coreRequirements.forEach(code => {
      // Check if it's in the core curriculum
      const cohortCore = CORE_CURRICULUM[state.selectedCohort];
      const inCore = ['T1', 'T2', 'T3'].some(term =>
        cohortCore[term]?.some(c => c.code === code)
      );

      if (inCore || (code === 'FNCE-6110' && state.financeChoice === 'FNCE-6110')) {
        // Find the course credit value
        let credits = 0;
        if (code === 'FNCE-6110') {
          credits = 1.0;
        } else {
          const coreEntry = ['T1', 'T2', 'T3']
            .flatMap(term => cohortCore[term] || [])
            .find(c => c.code === code);
          if (coreEntry) {
            credits = coreEntry.credits;
          }
        }
        completed += credits;
      }
    });
  }

  return { completed: Math.min(completed, major.requiredCUs), required: major.requiredCUs };
}

// Export
function exportPlan() {
  const cohort = COHORTS[state.selectedCohort];
  const totalCU = calculateTotalCU();

  let text = `WEMBA 51 Pathway Plan\n`;
  text += `========================\n\n`;
  text += `Cohort: ${cohort.name}\n`;
  text += `Total CU: ${totalCU.toFixed(1)} / 19.0\n`;
  text += `Status: ${totalCU >= 19.0 ? 'Graduation Ready' : 'In Progress'}\n`;

  if (state.targetMajors.length > 0) {
    text += `Target Major(s): ${state.targetMajors.map(m => MAJORS[m].name).join(', ')}\n`;
  }

  // Completed Block Courses (T1-T3)
  if (state.completedBlockCourses.length > 0) {
    text += `\n--- Completed Block Courses (Terms 1-3) ---\n\n`;
    const blockCU = getCompletedBlockCoursesCU();
    text += `Total: ${blockCU.toFixed(1)} CU\n\n`;
    state.completedBlockCourses.forEach(code => {
      // Normalize to hyphen format for EARLY_BLOCK_COURSES lookup
      const normalizedCode = code.replace(/\s+/g, '-');
      const course = EARLY_BLOCK_COURSES[normalizedCode];
      if (course) {
        text += `  - ${course.code}: ${course.title} (${course.credits} CU)\n`;
        text += `    Professor: ${course.professor} | ${course.dates}\n`;
      }
    });
    text += `\n`;
  }

  text += `\n--- Elective Courses ---\n\n`;

  ['T4', 'T5', 'T6', 'BW'].forEach(term => {
    const courses = getPlannedCoursesForTerm(term);
    if (courses.length > 0) {
      const termLabel = term === 'BW' ? 'Block Weeks' : `Term ${term.slice(1)}`;
      text += `${termLabel}:\n`;
      courses.forEach(c => {
        const offering = c.offerings[state.selectedCohort];
        text += `  - ${c.code.replace('-', ' ')}: ${c.title} (${c.credits} CU)\n`;
        text += `    Professor: ${offering.professor}\n`;
      });
      text += `\n`;
    }
  });

  // Create download
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wemba51-pathway-${cohort.shortName.toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearElectives() {
  if (confirm('Clear all planned elective courses?')) {
    state.plannedCourses = [];
    saveState();

    // Update all credit displays across all views instantly
    updateAllCreditDisplays();

    // Refresh view-specific content
    updateDashboard();
    updatePathway();

    // Update graph view if active
    if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
      renderGraphView();
    }
  }
}

// Evaluation Helper Functions
function getEvaluationData(courseCode, cohort) {
  const normalizedCode = courseCode.replace(/\s+/g, '-');
  const course = COURSES[normalizedCode];
  if (!course || !course.offerings || !course.offerings[cohort]) {
    return null;
  }
  return course.offerings[cohort].evaluations || null;
}

function getEvaluationColorClass(score, metric) {
  // Difficulty and Work Required are neutral metrics
  const neutralMetrics = ['courseDifficulty', 'workRequired'];
  if (neutralMetrics.includes(metric)) {
    return 'eval-neutral';
  }

  // For other metrics, higher is better
  if (score >= 3.5) return 'eval-excellent';
  if (score >= 3.0) return 'eval-good';
  if (score >= 2.5) return 'eval-average';
  return 'eval-poor';
}

function formatEvaluationScore(score) {
  if (score === null || score === undefined) return 'N/A';
  return score.toFixed(2);
}

function createMiniEvalChart(evaluations) {
  if (!evaluations) {
    return '<div class="eval-mini-chart eval-no-data">No ratings available</div>';
  }

  const keyMetrics = [
    { key: 'instructorQuality', label: 'Instructor' },
    { key: 'courseQuality', label: 'Course' },
    { key: 'courseDifficulty', label: 'Difficulty' },
    { key: 'workRequired', label: 'Workload' }
  ];

  const bars = keyMetrics.map(({ key, label }) => {
    const score = evaluations[key];
    if (score === undefined || score === null) return '';

    const pct = (score / 4) * 100;
    const colorClass = getEvaluationColorClass(score, key);

    return `
      <div class="mini-bar-row">
        <span class="mini-bar-label">${label}</span>
        <div class="mini-bar-track">
          <div class="mini-bar-fill ${colorClass}" style="width: ${pct}%"></div>
        </div>
        <span class="mini-bar-score">${score.toFixed(1)}</span>
      </div>
    `;
  }).filter(Boolean).join('');

  if (!bars) {
    return '<div class="eval-mini-chart eval-no-data">No ratings available</div>';
  }

  return `<div class="eval-mini-chart">${bars}</div>`;
}

function createFullEvalSection(evaluations, professor) {
  if (!evaluations) {
    return `
      <div class="eval-section">
        <h4>Course Evaluations</h4>
        <p class="eval-no-data">No evaluation data available for this course.</p>
      </div>
    `;
  }

  const categories = {
    instructor: {
      label: 'Instructor Ratings',
      metrics: ['instructorQuality', 'instructorCommunication', 'instructorStimulateInterest', 'instructorAccessibility']
    },
    course: {
      label: 'Course Ratings',
      metrics: ['courseQuality', 'valueOfReadings', 'knowledgeLearned']
    },
    workload: {
      label: 'Workload & Difficulty',
      metrics: ['courseDifficulty', 'workRequired']
    },
    recommendations: {
      label: 'Recommendations',
      metrics: ['recommendToMajor', 'recommendToNonMajor']
    }
  };

  let html = `
    <div class="eval-section">
      <h4>Course Evaluations</h4>
      <p class="eval-professor-note">Ratings for ${professor}</p>
  `;

  for (const [catKey, cat] of Object.entries(categories)) {
    const availableMetrics = cat.metrics.filter(m => evaluations[m] !== undefined);
    if (availableMetrics.length === 0) continue;

    html += `<div class="eval-category"><h5>${cat.label}</h5>`;

    for (const metricKey of availableMetrics) {
      const metric = EVALUATION_METRICS[metricKey];
      const score = evaluations[metricKey];
      const pct = (score / 4) * 100;
      const colorClass = getEvaluationColorClass(score, metricKey);

      html += `
        <div class="eval-bar-row">
          <span class="eval-bar-label">${metric.label}</span>
          <div class="eval-bar-track">
            <div class="eval-bar-fill ${colorClass}" style="width: ${pct}%"></div>
          </div>
          <span class="eval-bar-score">${score.toFixed(2)}</span>
        </div>
      `;
    }

    html += '</div>';
  }

  html += `
      <p class="eval-scale-note">Scale: 1.0 (Low) - 4.0 (High)</p>
    </div>
  `;

  return html;
}

// State Management
function saveState() {
  localStorage.setItem('wemba-pathway-state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('wemba-pathway-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const courseAliases = {
        'LGST-7820': 'LGST-XXXX'
      };
      if (parsed.plannedCourses) {
        parsed.plannedCourses = parsed.plannedCourses.map(code => courseAliases[code] || code);
      }
      if (parsed.waivedCourses) {
        parsed.waivedCourses = parsed.waivedCourses.map(code => courseAliases[code] || code);
      }
      state = { ...state, ...parsed };

      // Restore major highlights if target majors exist
      if (state.targetMajors && state.targetMajors.length > 0) {
        updateMajorHighlights();
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }
}

// Make functions available globally
window.switchView = switchView;
window.addCourse = addCourse;
window.removeCourse = removeCourse;
window.showCourseDetails = showCourseDetails;
window.closeModal = closeModal;
window.addCourseToTerm = addCourseToTerm;
window.closeAddCourseModal = closeAddCourseModal;
window.addCourseAndClose = addCourseAndClose;
window.toggleTargetMajor = toggleTargetMajor;
window.exportPlan = exportPlan;
window.clearElectives = clearElectives;
window.toggleCompletedBlockCourse = toggleCompletedBlockCourse;
window.updateAllCreditDisplays = updateAllCreditDisplays;
window.closeFinanceModal = closeFinanceModal;
window.selectFinanceAndProceed = selectFinanceAndProceed;
window.navigateToMajor = navigateToMajor;
