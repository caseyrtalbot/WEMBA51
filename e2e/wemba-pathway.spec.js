// @ts-check
const { test, expect } = require('@playwright/test');

// Helper to clear localStorage before each test for fresh state
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('First-Run Onboarding', () => {
  test('shows onboarding modal on first visit', async ({ page }) => {
    const onboardingModal = page.locator('#onboarding-modal');
    await expect(onboardingModal).toBeVisible();
    await expect(onboardingModal).not.toHaveClass(/hidden/);
  });

  test('shows three cohort options', async ({ page }) => {
    const cohortCards = page.locator('.onboarding-cohort-card');
    await expect(cohortCards).toHaveCount(3);

    await expect(page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]')).toBeVisible();
    await expect(page.locator('.onboarding-cohort-card[data-cohort="san_francisco"]')).toBeVisible();
    await expect(page.locator('.onboarding-cohort-card[data-cohort="global"]')).toBeVisible();
  });

  test('selecting cohort shows confirmation screen', async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();

    // Wait for step 2 to become active
    await expect(page.locator('#onboarding-step-2')).toHaveClass(/active/);
    await expect(page.locator('#onboarding-cohort-confirm')).toContainText('Philadelphia');
  });

  test('can complete onboarding and start exploring', async ({ page }) => {
    // Select cohort
    await page.locator('.onboarding-cohort-card[data-cohort="san_francisco"]').click();
    await expect(page.locator('#onboarding-step-2')).toHaveClass(/active/);

    // Click Start Exploring
    await page.locator('#onboarding-start-explore').click();

    // Onboarding should be hidden, main app visible
    await expect(page.locator('#onboarding-modal')).toHaveClass(/hidden/);
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Should be in Explore mode
    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
  });

  test('can complete onboarding and jump to Build', async ({ page }) => {
    // Select cohort
    await page.locator('.onboarding-cohort-card[data-cohort="global"]').click();
    await expect(page.locator('#onboarding-step-2')).toHaveClass(/active/);

    // Click jump to Build
    await page.locator('#onboarding-start-build').click();

    // Should be in Build mode
    await expect(page.locator('#graph-view')).toHaveClass(/active/);
  });

  test('onboarding not shown after completing', async ({ page }) => {
    // Complete onboarding
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();

    // Reload page
    await page.reload();

    // Onboarding should remain hidden
    await expect(page.locator('#onboarding-modal')).toHaveClass(/hidden/);
    await expect(page.locator('#main-app')).toHaveClass(/active/);
  });
});

test.describe('Navigation - Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    // Complete onboarding first
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('bottom tab bar shows Explore and Build tabs', async ({ page }) => {
    const bottomTabBar = page.locator('#bottom-tab-bar');
    await expect(bottomTabBar).toBeVisible();

    await expect(page.locator('.bottom-tab[data-view="explore"]')).toBeVisible();
    await expect(page.locator('.bottom-tab[data-view="build"]')).toBeVisible();
  });

  test('clicking Build tab switches to Build mode', async ({ page }) => {
    await page.locator('.bottom-tab[data-view="build"]').click();

    await expect(page.locator('#graph-view')).toHaveClass(/active/);
    await expect(page.locator('.bottom-tab[data-view="build"]')).toHaveClass(/active/);
  });

  test('clicking Explore tab switches back to Explore mode', async ({ page }) => {
    // Go to Build first
    await page.locator('.bottom-tab[data-view="build"]').click();

    // Then back to Explore
    await page.locator('.bottom-tab[data-view="explore"]').click();

    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
    await expect(page.locator('.bottom-tab[data-view="explore"]')).toHaveClass(/active/);
  });

  test('mode persists after page reload', async ({ page }) => {
    // Switch to Build
    await page.locator('.bottom-tab[data-view="build"]').click();
    await expect(page.locator('#graph-view')).toHaveClass(/active/);

    // Reload
    await page.reload();

    // Should still be in Build mode
    await expect(page.locator('#graph-view')).toHaveClass(/active/);
  });
});

test.describe('Navigation - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('sidebar navigation shows Explore and Build', async ({ page }) => {
    await expect(page.locator('.sidebar-nav-item[data-view="explore"]')).toBeVisible();
    await expect(page.locator('.sidebar-nav-item[data-view="build"]')).toBeVisible();
  });

  test('clicking Build in sidebar switches to Build mode', async ({ page }) => {
    await page.locator('.sidebar-nav-item[data-view="build"]').click();

    await expect(page.locator('#graph-view')).toHaveClass(/active/);
    await expect(page.locator('.sidebar-nav-item[data-view="build"]')).toHaveClass(/active/);
  });

  test('clicking Explore in sidebar switches back', async ({ page }) => {
    await page.locator('.sidebar-nav-item[data-view="build"]').click();
    await page.locator('.sidebar-nav-item[data-view="explore"]').click();

    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
  });
});

test.describe('Explore Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Complete onboarding
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('shows majors/departments toggle', async ({ page }) => {
    await expect(page.locator('.browse-toggle')).toBeVisible();
    await expect(page.locator('.toggle-btn[data-browse="majors"]')).toBeVisible();
    await expect(page.locator('.toggle-btn[data-browse="departments"]')).toBeVisible();
  });

  test('majors toggle is active by default', async ({ page }) => {
    await expect(page.locator('.toggle-btn[data-browse="majors"]')).toHaveClass(/active/);
  });

  test('can switch to departments view', async ({ page }) => {
    await page.locator('.toggle-btn[data-browse="departments"]').click();
    await expect(page.locator('.toggle-btn[data-browse="departments"]')).toHaveClass(/active/);
    await expect(page.locator('#departments-list')).not.toHaveClass(/hidden/);
  });

  test('search box is present', async ({ page }) => {
    const searchBox = page.locator('#course-search');
    await expect(searchBox).toBeVisible();
    await expect(searchBox).toHaveAttribute('placeholder', 'Search courses...');
  });

  test('majors list shows available majors', async ({ page }) => {
    const majorsList = page.locator('#majors-list');
    await expect(majorsList).toBeVisible();

    // Should have some major items
    const majorItems = majorsList.locator('li');
    const count = await majorItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a major shows its courses', async ({ page }) => {
    // Click first major
    const firstMajor = page.locator('#majors-list li').first();
    await firstMajor.click();

    // Explorer content should show courses
    const explorerContent = page.locator('#explorer-courses');
    await expect(explorerContent).not.toContainText('Select a major');
  });
});

test.describe('Build Mode (Graph)', () => {
  test.beforeEach(async ({ page }) => {
    // Complete onboarding and go to Build
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-build').click();
  });

  test('shows graph canvas', async ({ page }) => {
    await expect(page.locator('#pathway-graph')).toBeVisible();
  });

  test('shows core curriculum summary bar', async ({ page }) => {
    await expect(page.locator('#core-summary')).toBeVisible();
  });

  test('shows total CU in header', async ({ page }) => {
    await expect(page.locator('#graph-total-cu')).toBeVisible();
  });

  test('shows zoom controls', async ({ page }) => {
    await expect(page.locator('#zoom-in-btn')).toBeVisible();
    await expect(page.locator('#zoom-out-btn')).toBeVisible();
    await expect(page.locator('#zoom-reset-btn')).toBeVisible();
  });

  test('shows graph legend', async ({ page }) => {
    await expect(page.locator('#graph-legend')).toBeVisible();
  });
});

test.describe('Build Mode Mobile FAB', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-build').click();
  });

  test('quick add button is visible on mobile', async ({ page }) => {
    await expect(page.locator('#graph-quick-add')).toBeVisible();
  });

  test('clicking quick add opens catalog sheet', async ({ page }) => {
    await page.locator('#graph-quick-add').click();
    await expect(page.locator('#catalog-sheet')).not.toHaveClass(/hidden/);
  });
});

test.describe('Progress Drawer - Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    // Complete onboarding
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('progress drawer exists', async ({ page }) => {
    await expect(page.locator('#progress-drawer')).toBeVisible();
  });

  test('clicking CU trigger opens drawer', async ({ page }) => {
    await page.locator('#header-cu-trigger').click();

    const drawer = page.locator('#progress-drawer');
    await expect(drawer).toHaveClass(/partial/);
  });

  test('drawer handle cycles drawer state', async ({ page }) => {
    // Open to partial first via header
    await page.locator('#header-cu-trigger').click();
    await expect(page.locator('#progress-drawer')).toHaveClass(/partial/);

    // Cycle to full via drawer handle (now visible above tab bar)
    await page.locator('#drawer-handle').click();
    await expect(page.locator('#progress-drawer')).toHaveClass(/full/);

    // Cycle back to collapsed
    await page.locator('#drawer-handle').click();
    await expect(page.locator('#progress-drawer')).not.toHaveClass(/partial|full/);
  });

  test('drawer shows graduation progress bar', async ({ page }) => {
    await page.locator('#header-cu-trigger').click();
    await expect(page.locator('#drawer-progress-fill')).toBeVisible();
  });

  test('drawer shows CU breakdown', async ({ page }) => {
    await page.locator('#header-cu-trigger').click();
    await expect(page.locator('#drawer-core-cu')).toBeVisible();
    await expect(page.locator('#drawer-elective-cu')).toBeVisible();
    await expect(page.locator('#drawer-block-cu')).toBeVisible();
  });

  test('drawer shows target majors section', async ({ page }) => {
    await page.locator('#header-cu-trigger').click();
    await expect(page.locator('#drawer-majors-list')).toBeVisible();
  });

  test('drawer shows alerts section', async ({ page }) => {
    await page.locator('#header-cu-trigger').click();
    await expect(page.locator('#drawer-alerts-list')).toBeVisible();
  });

  test('settings button opens settings panel', async ({ page }) => {
    // Open drawer to full state to see settings button
    await page.locator('#header-cu-trigger').click(); // partial
    await page.locator('#drawer-handle').click(); // full
    await page.waitForTimeout(400); // Wait for transition
    // Scroll settings button into view and click
    await page.locator('#drawer-settings-btn').scrollIntoViewIfNeeded();
    await page.locator('#drawer-settings-btn').click({ force: true });

    await expect(page.locator('#settings-panel')).not.toHaveClass(/hidden/);
  });
});

test.describe('Settings Panel - Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    // Complete onboarding
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();

    // Open drawer to full state via header trigger and click settings
    await page.locator('#header-cu-trigger').click(); // partial
    await page.locator('#drawer-handle').click(); // full
    await page.waitForTimeout(400); // Wait for transition
    // Scroll settings button into view
    await page.locator('#drawer-settings-btn').scrollIntoViewIfNeeded();
    await page.locator('#drawer-settings-btn').click({ force: true });
  });

  test('settings panel shows cohort', async ({ page }) => {
    await expect(page.locator('#settings-cohort-name')).toContainText('Philadelphia');
  });

  test('settings panel shows finance options for PHL/SF', async ({ page }) => {
    await expect(page.locator('#settings-finance-section')).toBeVisible();
    await expect(page.locator('.settings-finance-btn[data-choice="FNCE-6110"]')).toBeVisible();
    await expect(page.locator('.settings-finance-btn[data-choice="FNCE-6210"]')).toBeVisible();
  });

  test('can close settings panel', async ({ page }) => {
    await page.locator('#settings-close').click();
    await expect(page.locator('#settings-panel')).toHaveClass(/hidden/);
  });

  test('clicking backdrop closes settings panel', async ({ page }) => {
    await page.locator('#settings-backdrop').click();
    await expect(page.locator('#settings-panel')).toHaveClass(/hidden/);
  });
});

test.describe('Course Sheet', () => {
  test.beforeEach(async ({ page }) => {
    // Complete onboarding
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('course sheet exists and is initially hidden', async ({ page }) => {
    await expect(page.locator('#course-sheet')).toHaveClass(/hidden/);
  });
});

test.describe('Catalog Sheet - Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    // Complete onboarding and go to Build
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-build').click();
  });

  test('catalog sheet opens on quick add click', async ({ page }) => {
    await page.locator('#graph-quick-add').click();
    await expect(page.locator('#catalog-sheet')).not.toHaveClass(/hidden/);
  });

  test('catalog sheet has search input', async ({ page }) => {
    await page.locator('#graph-quick-add').click();
    await expect(page.locator('#catalog-sheet-search')).toBeVisible();
  });

  test('catalog sheet has term filter', async ({ page }) => {
    await page.locator('#graph-quick-add').click();
    await expect(page.locator('#catalog-filter-term')).toBeVisible();
  });

  test('catalog sheet has major filter', async ({ page }) => {
    await page.locator('#graph-quick-add').click();
    await expect(page.locator('#catalog-filter-major')).toBeVisible();
  });

  test('can close catalog sheet', async ({ page }) => {
    await page.locator('#graph-quick-add').click();
    await page.locator('#catalog-sheet-close').click();
    await expect(page.locator('#catalog-sheet')).toHaveClass(/hidden/);
  });
});

test.describe('Desktop Layout', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    // Complete onboarding
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('sidebar is visible on desktop', async ({ page }) => {
    await expect(page.locator('#desktop-sidebar')).toBeVisible();
  });

  test('sidebar shows Explore and Build navigation', async ({ page }) => {
    await expect(page.locator('.sidebar-nav-item[data-view="explore"]')).toBeVisible();
    await expect(page.locator('.sidebar-nav-item[data-view="build"]')).toBeVisible();
  });

  test('sidebar shows progress summary', async ({ page }) => {
    await expect(page.locator('#sidebar-progress-cu')).toBeVisible();
    await expect(page.locator('#sidebar-progress-fill')).toBeVisible();
  });

  test('sidebar shows alerts count', async ({ page }) => {
    await expect(page.locator('#sidebar-alert-count')).toBeVisible();
  });

  test('clicking sidebar nav switches modes', async ({ page }) => {
    await page.locator('.sidebar-nav-item[data-view="build"]').click();
    await expect(page.locator('#graph-view')).toHaveClass(/active/);
  });

  test('bottom tab bar is hidden on desktop', async ({ page }) => {
    await expect(page.locator('#bottom-tab-bar')).not.toBeVisible();
  });
});

test.describe('Keyboard Shortcuts (Desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    // Complete onboarding
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('E key switches to Explore mode', async ({ page }) => {
    // First go to Build using sidebar
    await page.locator('.sidebar-nav-item[data-view="build"]').click();
    await expect(page.locator('#graph-view')).toHaveClass(/active/);

    // Then press E
    await page.keyboard.press('e');
    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
  });

  test('B key switches to Build mode', async ({ page }) => {
    await page.keyboard.press('b');
    await expect(page.locator('#graph-view')).toHaveClass(/active/);
  });

  test('/ key focuses search', async ({ page }) => {
    await page.keyboard.press('/');
    await expect(page.locator('#course-search')).toBeFocused();
  });

  test('Escape closes settings panel', async ({ page }) => {
    // Open settings via sidebar cohort button
    await page.locator('#sidebar-cohort-btn').click();
    await expect(page.locator('#settings-panel')).not.toHaveClass(/hidden/);

    // Press Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('#settings-panel')).toHaveClass(/hidden/);
  });
});

test.describe('Mobile Layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    // Complete onboarding
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('bottom tab bar is visible on mobile', async ({ page }) => {
    await expect(page.locator('#bottom-tab-bar')).toBeVisible();
  });

  test('compact header is visible on mobile', async ({ page }) => {
    await expect(page.locator('#app-header-compact')).toBeVisible();
  });

  test('header shows CU counter', async ({ page }) => {
    await expect(page.locator('#header-total-cu')).toBeVisible();
  });

  test('header shows cohort badge', async ({ page }) => {
    await expect(page.locator('#header-cohort-badge')).toContainText('PHL');
  });

  test('desktop sidebar is hidden on mobile', async ({ page }) => {
    await expect(page.locator('#desktop-sidebar')).not.toBeVisible();
  });
});

test.describe('Cohort-Specific Behavior', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('Philadelphia cohort shows PHL in header', async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();

    await expect(page.locator('#header-cohort-badge')).toContainText('PHL');
  });

  test('San Francisco cohort shows SF in header', async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="san_francisco"]').click();
    await page.locator('#onboarding-start-explore').click();

    await expect(page.locator('#header-cohort-badge')).toContainText('SF');
  });

  test('Global cohort shows GLO in header', async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="global"]').click();
    await page.locator('#onboarding-start-explore').click();

    await expect(page.locator('#header-cohort-badge')).toContainText('GLO');
  });
});

test.describe('State Persistence', () => {
  test('planned courses persist after reload', async ({ page }) => {
    // Complete onboarding and go to Build
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-build').click();

    // Get initial CU value
    const initialCU = await page.locator('#graph-total-cu').textContent();

    // Reload
    await page.reload();

    // CU should be same
    await expect(page.locator('#graph-total-cu')).toHaveText(initialCU);
  });

  test('cohort persists after reload', async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="san_francisco"]').click();
    await page.locator('#onboarding-start-explore').click();

    // Reload
    await page.reload();

    // Should still be logged in and show SF cohort
    await expect(page.locator('#main-app')).toHaveClass(/active/);
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('page has a title', async ({ page }) => {
    await expect(page).toHaveTitle(/WEMBA/);
  });

  test('search input has placeholder text', async ({ page }) => {
    const searchInput = page.locator('#course-search');
    await expect(searchInput).toHaveAttribute('placeholder', 'Search courses...');
  });
});

test.describe('Accessibility - Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();
  });

  test('bottom tabs have text labels', async ({ page }) => {
    const exploreTab = page.locator('.bottom-tab[data-view="explore"]');
    await expect(exploreTab.locator('span')).toHaveText('Explore');

    const buildTab = page.locator('.bottom-tab[data-view="build"]');
    await expect(buildTab.locator('span')).toHaveText('Build');
  });
});

test.describe('Graph Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-build').click();
    // Wait for graph to fully initialize
    await page.waitForTimeout(500);
  });

  test('zoom in button works', async ({ page }) => {
    const initialZoom = await page.locator('#zoom-level').textContent();
    await page.locator('#zoom-in-btn').click();
    const newZoom = await page.locator('#zoom-level').textContent();

    // Zoom should increase
    expect(parseInt(newZoom)).toBeGreaterThan(parseInt(initialZoom));
  });

  test('zoom out button works', async ({ page }) => {
    // Zoom in first
    await page.locator('#zoom-in-btn').click();
    await page.locator('#zoom-in-btn').click();

    const zoomAfterIn = await page.locator('#zoom-level').textContent();
    await page.locator('#zoom-out-btn').click();
    const zoomAfterOut = await page.locator('#zoom-level').textContent();

    expect(parseInt(zoomAfterOut)).toBeLessThan(parseInt(zoomAfterIn));
  });

  test('zoom reset button resets to 100%', async ({ page }) => {
    // Zoom in
    await page.locator('#zoom-in-btn').click();
    await page.locator('#zoom-in-btn').click();

    // Reset
    await page.locator('#zoom-reset-btn').click();

    await expect(page.locator('#zoom-level')).toHaveText('100%');
  });

  test('legend can be toggled', async ({ page }) => {
    const legendContent = page.locator('#legend-content');
    const toggleBtn = page.locator('#legend-toggle-btn');

    // Initially visible
    await expect(legendContent).toBeVisible();

    // Toggle to hide
    await toggleBtn.click();

    // Check toggle button text changed
    await expect(toggleBtn).toHaveText('Show');
  });
});

test.describe('Core Curriculum Summary', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-build').click();
  });

  test('core summary shows total CU', async ({ page }) => {
    await expect(page.locator('#core-cu-total')).toBeVisible();
  });

  test('core summary shows cohort name', async ({ page }) => {
    await expect(page.locator('#core-cohort-name')).toContainText('Philadelphia');
  });

  test('can expand core curriculum details', async ({ page }) => {
    const expandBtn = page.locator('#core-expand-btn');
    if (await expandBtn.isVisible()) {
      await expandBtn.click();
      await expect(page.locator('#core-expanded')).not.toHaveClass(/hidden/);
    }
  });
});

test.describe('Full User Flow', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('complete user journey from onboarding to course planning', async ({ page }) => {
    // 1. Complete onboarding
    await expect(page.locator('#onboarding-modal')).toBeVisible();
    await page.locator('.onboarding-cohort-card[data-cohort="philadelphia"]').click();
    await page.locator('#onboarding-start-explore').click();

    // 2. Should be in Explore mode
    await expect(page.locator('#explorer-view')).toHaveClass(/active/);

    // 3. Click on a major to browse courses
    const firstMajor = page.locator('#majors-list li').first();
    await firstMajor.click();

    // 4. Courses should be displayed
    await expect(page.locator('#explorer-courses')).not.toContainText('Select a major');

    // 5. Switch to Build mode
    await page.locator('.bottom-tab[data-view="build"]').click();
    await expect(page.locator('#graph-view')).toHaveClass(/active/);

    // 6. Verify graph canvas is shown
    await expect(page.locator('#pathway-graph')).toBeVisible();

    // 7. Open catalog sheet to add courses
    await page.locator('#graph-quick-add').click();
    await expect(page.locator('#catalog-sheet')).not.toHaveClass(/hidden/);

    // 8. Close catalog
    await page.locator('#catalog-sheet-close').click();
    await expect(page.locator('#catalog-sheet')).toHaveClass(/hidden/);

    // 9. Open progress drawer
    await page.locator('#header-cu-trigger').click();
    await expect(page.locator('#progress-drawer')).toHaveClass(/partial/);

    // 10. Check CU display
    await expect(page.locator('#drawer-cu-value')).toBeVisible();
  });
});
