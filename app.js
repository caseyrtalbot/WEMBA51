// WEMBA 51 Pathway Planner - Application Logic

// Application State
let state = {
  selectedCohort: null,
  plannedCourses: [],
  targetMajors: [],
  waivedCourses: [],
  financeChoice: null, // 'FNCE-6110' or 'FNCE-6210'
  currentView: 'dashboard',
  explorerMode: 'majors',
  selectedMajor: null,
  selectedDepartment: null
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initEventListeners();

  if (state.selectedCohort) {
    showMainApp();
  }
});

// Event Listeners
function initEventListeners() {
  // Cohort selection
  document.querySelectorAll('.cohort-card').forEach(card => {
    card.addEventListener('click', () => {
      selectCohort(card.dataset.cohort);
    });
  });

  // Cohort switcher
  document.getElementById('cohort-switcher').addEventListener('click', () => {
    const cohortSelection = document.getElementById('cohort-selection');
    cohortSelection.classList.remove('hidden');
    cohortSelection.classList.add('active');
    document.getElementById('main-app').classList.remove('active');
  });

  // Navigation tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchView(tab.dataset.view);
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
  state.selectedCohort = cohortId;

  // Set default finance choice for Global (no option)
  if (cohortId === 'global') {
    state.financeChoice = 'FNCE-6110';
  }

  // Add visual feedback to selected card
  const selectedCard = document.querySelector(`.cohort-card[data-cohort="${cohortId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  saveState();

  // Brief delay before transition for click feedback
  setTimeout(() => {
    showMainApp();
  }, 150);
}

function showMainApp() {
  const cohortSelection = document.getElementById('cohort-selection');
  const mainApp = document.getElementById('main-app');

  // Prepare data first
  updateCohortDisplay();
  populateSidebar();
  updateDashboard();
  updatePathway();

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

  // Step 4: Clean up after animation completes
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
  }, 600);
}

function updateCohortDisplay() {
  const cohort = COHORTS[state.selectedCohort];
  document.getElementById('current-cohort-name').textContent = cohort.name;

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

  document.querySelectorAll('.decision-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.choice === choice);
  });

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

// View Navigation
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
    if (typeof initGraphBuilder === 'function') {
      initGraphBuilder();
    }
  }
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
      <div class="major-progress-item">
        <div class="major-info">
          <strong>${major.name}</strong>
          <span>${progress.completed.toFixed(1)} / ${major.requiredCUs} CU</span>
        </div>
        <div class="progress-bar-container" style="height: 8px; margin-top: 0.5rem;">
          <div class="progress-bar" style="width: ${Math.min(percent, 100)}%"></div>
        </div>
        ${percent >= 100 ? '<span class="status-badge ready" style="margin-top: 0.5rem;">Complete</span>' : ''}
      </div>
    `;
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
    if (!offering || offering.term === 'BW') return; // Skip block weeks - they have specific dates

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

        // Get weekend arrays (default to empty if not specified)
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
  const termLabel = offering.term === 'BW' ? 'Block Week' : `Term ${offering.term.slice(1)}`;

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
}

// Course Management
function addCourse(courseCode) {
  // Normalize course code to use hyphens (e.g., 'FNCE 7320' -> 'FNCE-7320')
  const normalizedCode = courseCode.replace(/\s+/g, '-');
  if (!state.plannedCourses.includes(normalizedCode)) {
    state.plannedCourses.push(normalizedCode);
    saveState();

    // Refresh displays
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

  // Refresh displays
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

function toggleTargetMajor(majorId) {
  if (state.targetMajors.includes(majorId)) {
    state.targetMajors = state.targetMajors.filter(m => m !== majorId);
  } else {
    state.targetMajors.push(majorId);
  }
  saveState();

  updateDashboard();
  if (state.selectedMajor === majorId) {
    displayMajorCourses(majorId);
  }

  // Update graph view if active
  if (typeof renderGraphView === 'function' && state.currentView === 'graph') {
    renderGraphView();
  }
}

// Pathway
function updatePathway() {
  const cohort = state.selectedCohort;
  const coreCurriculum = CORE_CURRICULUM[cohort];

  // Update Terms 1-3 (core)
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

    const totalCU = termCourses.reduce((sum, c) => sum + c.credits, 0);
    cuDisplay.textContent = `${totalCU.toFixed(1)} CU`;

    coursesList.innerHTML = termCourses.map(course => `
      <li>
        <span class="course-name">${course.code.replace('-', ' ')}: ${course.title}</span>
        <span class="course-cu">${course.credits} CU</span>
      </li>
    `).join('');
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
  const course = COURSES[courseCode];
  const offering = course.offerings[state.selectedCohort];
  const modal = document.getElementById('course-modal');
  const body = document.getElementById('modal-body');

  const inPlan = state.plannedCourses.includes(courseCode);
  const termLabel = offering.term === 'BW' ? 'Block Week' : `Term ${offering.term.slice(1)}`;

  // Find which majors this course applies to
  const applicableMajors = Object.entries(MAJORS)
    .filter(([id, major]) =>
      major.electiveCourses?.includes(courseCode) ||
      major.primaryCourses?.includes(courseCode) ||
      major.secondaryCourses?.includes(courseCode)
    )
    .map(([id, major]) => major.name);

  // Check prerequisites
  const prereqInfo = getPrerequisiteInfo(courseCode);

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

    <div style="margin-top: 1.5rem;">
      ${inPlan ?
        `<button class="btn-secondary" onclick="removeCourse('${courseCode}'); closeModal();" style="width: 100%;">Remove from Plan</button>` :
        `<button class="btn-primary" onclick="addCourse('${courseCode}'); closeModal();" style="width: 100%;">Add to Plan</button>`
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

function calculateMajorProgress(majorId) {
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
    updateDashboard();
    updatePathway();
  }
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
      state = { ...state, ...parsed };
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
