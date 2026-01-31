// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Course Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Select Global cohort
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Navigate to Explorer
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
  });

  test('should display Explorer view correctly', async ({ page }) => {
    await expect(page.locator('.explorer-filters')).toBeVisible();
    await expect(page.locator('.explorer-content')).toBeVisible();
    await expect(page.locator('#explorer-title')).toContainText('Select a Major or Department');
  });

  test('should show browse toggle for majors and departments', async ({ page }) => {
    await expect(page.locator('.browse-toggle')).toBeVisible();
    await expect(page.locator('.toggle-btn[data-browse="majors"]')).toHaveClass(/active/);
    await expect(page.locator('.toggle-btn[data-browse="departments"]')).toBeVisible();
  });

  test('should display majors list by default', async ({ page }) => {
    await expect(page.locator('#majors-list')).toBeVisible();
    await expect(page.locator('#departments-list')).toHaveClass(/hidden/);
    await expect(page.locator('#majors-list .sidebar-item')).not.toHaveCount(0);
  });

  test('should switch to departments view', async ({ page }) => {
    await page.locator('.toggle-btn[data-browse="departments"]').click();

    await expect(page.locator('#majors-list')).toHaveClass(/hidden/);
    await expect(page.locator('#departments-list')).toBeVisible();
    await expect(page.locator('#departments-list .sidebar-item')).not.toHaveCount(0);
  });

  test('should display courses when selecting a major', async ({ page }) => {
    // Click on first major
    await page.locator('#majors-list .sidebar-item').first().click();

    // Courses should appear
    await expect(page.locator('#explorer-courses .course-card')).not.toHaveCount(0);

    // Header should update
    await expect(page.locator('#explorer-title')).not.toContainText('Select a Major');
  });

  test('should display courses when selecting a department', async ({ page }) => {
    await page.locator('.toggle-btn[data-browse="departments"]').click();
    await page.locator('#departments-list .sidebar-item').first().click();

    // Courses should appear
    await expect(page.locator('#explorer-courses .course-card')).not.toHaveCount(0);
  });

  test('should show Set as Target Major button when viewing a major', async ({ page }) => {
    await page.locator('#majors-list .sidebar-item').first().click();

    await expect(page.locator('button:has-text("Set as Target Major")')).toBeVisible();
  });

  test('should toggle target major status', async ({ page }) => {
    await page.locator('#majors-list .sidebar-item').first().click();

    // Set as target major
    await page.locator('button:has-text("Set as Target Major")').click();

    // Button should change to "Remove"
    await expect(page.locator('button:has-text("Remove from Target Majors")')).toBeVisible();

    // Remove from target majors
    await page.locator('button:has-text("Remove from Target Majors")').click();

    // Button should change back
    await expect(page.locator('button:has-text("Set as Target Major")')).toBeVisible();
  });

  test('should add course to plan', async ({ page }) => {
    await page.locator('#majors-list .sidebar-item').first().click();
    await expect(page.locator('#explorer-courses .course-card')).not.toHaveCount(0);

    // Click "Add to Plan" on first course
    await page.locator('.course-btn.add').first().click();

    // Button should change to "Remove"
    await expect(page.locator('.course-btn.remove').first()).toBeVisible();
  });

  test('should remove course from plan', async ({ page }) => {
    await page.locator('#majors-list .sidebar-item').first().click();

    // Add course first
    await page.locator('.course-btn.add').first().click();
    await expect(page.locator('.course-btn.remove').first()).toBeVisible();

    // Remove course
    await page.locator('.course-btn.remove').first().click();

    // Button should change back to "Add"
    await expect(page.locator('.course-btn.add').first()).toBeVisible();
  });

  test('should update CU display when adding course', async ({ page }) => {
    const initialCu = await page.locator('#total-cu').textContent();

    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('.course-btn.add').first().click();

    const newCu = await page.locator('#total-cu').textContent();
    expect(parseFloat(newCu)).toBeGreaterThan(parseFloat(initialCu));
  });

  test('should show course details modal', async ({ page }) => {
    await page.locator('#majors-list .sidebar-item').first().click();

    // Click "Details" button on first course
    await page.locator('.course-btn.details').first().click();

    // Modal should appear
    await expect(page.locator('#course-modal')).toBeVisible();
    await expect(page.locator('#modal-body h2')).toBeVisible();
  });

  test('should close course details modal', async ({ page }) => {
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('.course-btn.details').first().click();
    await expect(page.locator('#course-modal')).toBeVisible();

    // Close modal
    await page.locator('.modal-close').click();

    await expect(page.locator('#course-modal')).toHaveClass(/hidden/);
  });

  test('should filter courses by search', async ({ page }) => {
    // Type in search box
    await page.locator('#course-search').fill('finance');

    // Should show search results
    await expect(page.locator('#explorer-title')).toContainText('Search Results');
    await expect(page.locator('#explorer-courses .course-card')).not.toHaveCount(0);
  });

  test('should highlight courses for target majors', async ({ page }) => {
    // Select a major and set as target
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('button:has-text("Set as Target Major")').click();

    // Courses should have major-highlight class
    await expect(page.locator('.course-card.major-highlight')).not.toHaveCount(0);
  });

  test('should show course card with correct information', async ({ page }) => {
    await page.locator('#majors-list .sidebar-item').first().click();

    const card = page.locator('.course-card').first();
    await expect(card.locator('.course-code')).toBeVisible();
    await expect(card.locator('.course-title')).toBeVisible();
    await expect(card.locator('.course-credits')).toBeVisible();
    await expect(card.locator('.course-actions')).toBeVisible();
  });
});
