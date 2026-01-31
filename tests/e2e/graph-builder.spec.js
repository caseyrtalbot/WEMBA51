// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Graph Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Select Global cohort
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Navigate to Graph Builder
    await page.locator('.nav-tab[data-view="graph"]').click();
    await expect(page.locator('#graph-view')).toHaveClass(/active/);
  });

  test('should display Graph Builder view correctly', async ({ page }) => {
    await expect(page.locator('.graph-layout')).toBeVisible();
    await expect(page.locator('.graph-catalog')).toBeVisible();
    await expect(page.locator('.graph-panel')).toBeVisible();
  });

  test('should display SVG canvas', async ({ page }) => {
    await expect(page.locator('#pathway-graph')).toBeVisible();
    await expect(page.locator('#connections-layer')).toBeVisible();
    await expect(page.locator('#nodes-layer')).toBeVisible();
  });

  test('should display core curriculum summary', async ({ page }) => {
    await expect(page.locator('#core-summary')).toBeVisible();
    await expect(page.locator('#core-cu-total')).toBeVisible();
  });

  test('should expand core curriculum details', async ({ page }) => {
    await page.locator('#core-expand-btn').click();

    await expect(page.locator('#core-expanded')).not.toHaveClass(/hidden/);
    await expect(page.locator('#core-collapsed')).toHaveClass(/hidden/);
  });

  test('should collapse core curriculum details', async ({ page }) => {
    // Expand first
    await page.locator('#core-expand-btn').click();
    await expect(page.locator('#core-expanded')).not.toHaveClass(/hidden/);

    // Then collapse
    await page.locator('#core-collapse-btn').click();

    await expect(page.locator('#core-expanded')).toHaveClass(/hidden/);
    await expect(page.locator('#core-collapsed')).not.toHaveClass(/hidden/);
  });

  test('should display zoom controls', async ({ page }) => {
    await expect(page.locator('.graph-controls')).toBeVisible();
    await expect(page.locator('#zoom-in-btn')).toBeVisible();
    await expect(page.locator('#zoom-out-btn')).toBeVisible();
    await expect(page.locator('#zoom-reset-btn')).toBeVisible();
    await expect(page.locator('#zoom-level')).toBeVisible();
  });

  test('should display legend', async ({ page }) => {
    await expect(page.locator('#graph-legend')).toBeVisible();
    await expect(page.locator('.legend-depts')).toBeVisible();
  });

  test('should display header stats', async ({ page }) => {
    await expect(page.locator('.graph-header-stats')).toBeVisible();
    await expect(page.locator('#graph-total-cu')).toBeVisible();
  });

  test('should display course catalog', async ({ page }) => {
    await expect(page.locator('.graph-catalog')).toBeVisible();
    await expect(page.locator('.catalog-header')).toBeVisible();
  });

  test('should show all courses by department when no majors selected', async ({ page }) => {
    // Catalog should show all courses grouped by department (no empty state)
    await expect(page.locator('#catalog-empty')).not.toBeVisible();
    await expect(page.locator('#catalog-majors')).toBeVisible();
    // Should have department sections with courses
    await expect(page.locator('.catalog-major')).not.toHaveCount(0);
    await expect(page.locator('.catalog-course')).not.toHaveCount(0);
  });

  test('should show major mode selector', async ({ page }) => {
    await expect(page.locator('#major-mode-selector')).toBeVisible();
    await expect(page.locator('.mode-btn[data-mode="all"]')).toHaveClass(/active/);
  });

  test('should zoom in when clicking zoom in button', async ({ page }) => {
    const initialZoom = await page.locator('#zoom-level').textContent();

    await page.locator('#zoom-in-btn').click();

    const newZoom = await page.locator('#zoom-level').textContent();
    expect(parseInt(newZoom)).toBeGreaterThan(parseInt(initialZoom));
  });

  test('should zoom out when clicking zoom out button', async ({ page }) => {
    // First zoom in
    await page.locator('#zoom-in-btn').click();
    const afterZoomIn = await page.locator('#zoom-level').textContent();

    // Then zoom out
    await page.locator('#zoom-out-btn').click();

    const afterZoomOut = await page.locator('#zoom-level').textContent();
    expect(parseInt(afterZoomOut)).toBeLessThan(parseInt(afterZoomIn));
  });

  test('should reset zoom when clicking reset button', async ({ page }) => {
    // Zoom in a few times
    await page.locator('#zoom-in-btn').click();
    await page.locator('#zoom-in-btn').click();

    // Reset
    await page.locator('#zoom-reset-btn').click();

    const zoomLevel = await page.locator('#zoom-level').textContent();
    expect(zoomLevel).toBe('100%');
  });

  test('should display conflict toggle button', async ({ page }) => {
    await expect(page.locator('#show-conflicts-btn')).toBeVisible();
  });

  test('should render course nodes when courses are planned', async ({ page }) => {
    // Add a course first
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('.course-btn.add').first().click();

    // Go back to Graph
    await page.locator('.nav-tab[data-view="graph"]').click();

    // Should have at least one course node
    await expect(page.locator('#nodes-layer .course-node')).not.toHaveCount(0);
  });

  test('should highlight major-relevant courses when target major is set', async ({ page }) => {
    // Set a target major
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('button:has-text("Set as Target Major")').click();

    // Go back to Graph
    await page.locator('.nav-tab[data-view="graph"]').click();

    // Catalog should still show all courses
    await expect(page.locator('#catalog-empty')).not.toBeVisible();
    await expect(page.locator('#catalog-majors')).toBeVisible();

    // Major-relevant courses should have the major-target highlight class
    await expect(page.locator('.catalog-course.major-target')).not.toHaveCount(0);

    // Should also show major badge in relevant department headers
    await expect(page.locator('.badge.major-badge')).not.toHaveCount(0);
  });

  test('should switch major display modes', async ({ page }) => {
    // Set a target major first
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('button:has-text("Set as Target Major")').click();

    // Go back to Graph
    await page.locator('.nav-tab[data-view="graph"]').click();

    // Click highlight mode
    await page.locator('.mode-btn[data-mode="highlight"]').click();
    await expect(page.locator('.mode-btn[data-mode="highlight"]')).toHaveClass(/active/);

    // Click filter mode
    await page.locator('.mode-btn[data-mode="filter"]').click();
    await expect(page.locator('.mode-btn[data-mode="filter"]')).toHaveClass(/active/);

    // Click all mode
    await page.locator('.mode-btn[data-mode="all"]').click();
    await expect(page.locator('.mode-btn[data-mode="all"]')).toHaveClass(/active/);
  });

  test('should display majors display when target major is set', async ({ page }) => {
    // Set a target major
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('button:has-text("Set as Target Major")').click();

    // Go back to Graph
    await page.locator('.nav-tab[data-view="graph"]').click();

    // Majors display should be visible
    await expect(page.locator('#graph-majors-display')).not.toHaveClass(/hidden/);
    await expect(page.locator('.major-tag')).toHaveCount(1);
  });

  test('should update CU display in graph view', async ({ page }) => {
    const initialCu = await page.locator('#graph-total-cu').textContent();

    // Add a course
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('.course-btn.add').first().click();

    // Go back to Graph
    await page.locator('.nav-tab[data-view="graph"]').click();

    const newCu = await page.locator('#graph-total-cu').textContent();
    expect(parseFloat(newCu)).toBeGreaterThan(parseFloat(initialCu));
  });

  test('should have interactive legend items', async ({ page }) => {
    await expect(page.locator('.legend-interactive')).not.toHaveCount(0);
  });

  test('should display header zoom controls', async ({ page }) => {
    await expect(page.locator('#zoom-in-btn-header')).toBeVisible();
    await expect(page.locator('#zoom-out-btn-header')).toBeVisible();
    await expect(page.locator('#zoom-level-header')).toBeVisible();
  });

  test('should display reset view button in header', async ({ page }) => {
    await expect(page.locator('#reset-view-btn')).toBeVisible();
  });
});
