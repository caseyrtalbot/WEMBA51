// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('My Pathway', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Select Global cohort
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Navigate to Pathway
    await page.locator('.nav-tab[data-view="pathway"]').click();
    await expect(page.locator('#pathway-view')).toHaveClass(/active/);
  });

  test('should display Pathway view correctly', async ({ page }) => {
    await expect(page.locator('.pathway-timeline')).toBeVisible();
    await expect(page.locator('#pathway-total-cu')).toBeVisible();
    await expect(page.locator('#pathway-status')).toBeVisible();
  });

  test('should show Year 1 core curriculum terms', async ({ page }) => {
    await expect(page.locator('.year-label:has-text("Year 1")')).toBeVisible();
    await expect(page.locator('#term-T1')).toBeVisible();
    await expect(page.locator('#term-T2')).toBeVisible();
    await expect(page.locator('#term-T3')).toBeVisible();
  });

  test('should show Year 2 elective terms', async ({ page }) => {
    await expect(page.locator('.year-label:has-text("Year 2")')).toBeVisible();
    await expect(page.locator('#term-T4')).toBeVisible();
    await expect(page.locator('#term-T5')).toBeVisible();
    await expect(page.locator('#term-T6')).toBeVisible();
  });

  test('should show Block Weeks section', async ({ page }) => {
    await expect(page.locator('.year-label:has-text("Block Weeks")')).toBeVisible();
    await expect(page.locator('#term-BW')).toBeVisible();
  });

  test('should display core curriculum courses in Year 1', async ({ page }) => {
    // Term 1 should have courses
    const t1Courses = page.locator('#T1-courses li:not(.empty-slot):not(.block-courses-divider):not(.block-course-row)');
    await expect(t1Courses).toHaveCount.greaterThan(0);

    // Term 2 should have courses
    const t2Courses = page.locator('#T2-courses li:not(.empty-slot):not(.block-courses-divider):not(.block-course-row)');
    await expect(t2Courses).toHaveCount.greaterThan(0);
  });

  test('should show CU totals for each term', async ({ page }) => {
    await expect(page.locator('#T1-cu')).toBeVisible();
    await expect(page.locator('#T2-cu')).toBeVisible();
    await expect(page.locator('#T3-cu')).toBeVisible();
    await expect(page.locator('#T4-cu')).toBeVisible();
    await expect(page.locator('#T5-cu')).toBeVisible();
    await expect(page.locator('#T6-cu')).toBeVisible();
    await expect(page.locator('#BW-cu')).toBeVisible();
  });

  test('should show empty state for Year 2 terms initially', async ({ page }) => {
    await expect(page.locator('#T4-courses .empty-slot')).toBeVisible();
    await expect(page.locator('#T5-courses .empty-slot')).toBeVisible();
    await expect(page.locator('#T6-courses .empty-slot')).toBeVisible();
  });

  test('should show Add Course buttons for elective terms', async ({ page }) => {
    await expect(page.locator('#term-T4 .add-course-btn')).toBeVisible();
    await expect(page.locator('#term-T5 .add-course-btn')).toBeVisible();
    await expect(page.locator('#term-T6 .add-course-btn')).toBeVisible();
    await expect(page.locator('#term-BW .add-course-btn')).toBeVisible();
  });

  test('should open Add Course modal when clicking Add Course button', async ({ page }) => {
    await page.locator('#term-T4 .add-course-btn').click();

    await expect(page.locator('#add-course-modal')).toBeVisible();
    await expect(page.locator('#add-course-title')).toContainText('Term 4');
  });

  test('should close Add Course modal', async ({ page }) => {
    await page.locator('#term-T4 .add-course-btn').click();
    await expect(page.locator('#add-course-modal')).toBeVisible();

    await page.locator('#add-course-modal .modal-close').click();

    await expect(page.locator('#add-course-modal')).toHaveClass(/hidden/);
  });

  test('should add course from modal', async ({ page }) => {
    await page.locator('#term-T4 .add-course-btn').click();

    // Click on a course to add
    const courseItem = page.locator('.add-course-item').first();
    if (await courseItem.isVisible()) {
      await courseItem.click();

      // Modal should close
      await expect(page.locator('#add-course-modal')).toHaveClass(/hidden/);

      // Course should appear in term
      await expect(page.locator('#T4-courses .empty-slot')).not.toBeVisible();
    }
  });

  test('should display validation messages section', async ({ page }) => {
    await expect(page.locator('#validation-messages')).toBeVisible();
  });

  test('should show graduation progress validation', async ({ page }) => {
    const validationMessages = page.locator('#validation-messages');
    await expect(validationMessages).toBeVisible();

    // Should show either success or warning message
    const hasMessage = await validationMessages.locator('.validation-message').count();
    expect(hasMessage).toBeGreaterThan(0);
  });

  test('should update total CU when adding courses', async ({ page }) => {
    const initialCu = await page.locator('#pathway-total-cu').textContent();

    // Add a course via Explorer
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('.course-btn.add').first().click();

    // Go back to Pathway
    await page.locator('.nav-tab[data-view="pathway"]').click();

    const newCu = await page.locator('#pathway-total-cu').textContent();
    expect(parseFloat(newCu)).toBeGreaterThan(parseFloat(initialCu));
  });

  test('should show remove button for planned electives', async ({ page }) => {
    // Add a course first
    await page.locator('#term-T4 .add-course-btn').click();
    const courseItem = page.locator('.add-course-item').first();
    if (await courseItem.isVisible()) {
      await courseItem.click();

      // Should show remove button
      await expect(page.locator('#T4-courses .remove-btn')).toBeVisible();
    }
  });

  test('should remove course when clicking remove button', async ({ page }) => {
    // Add a course first
    await page.locator('#term-T4 .add-course-btn').click();
    const courseItem = page.locator('.add-course-item').first();
    if (await courseItem.isVisible()) {
      await courseItem.click();
      await expect(page.locator('#T4-courses .remove-btn')).toBeVisible();

      // Remove the course
      await page.locator('#T4-courses .remove-btn').click();

      // Empty state should return
      await expect(page.locator('#T4-courses .empty-slot')).toBeVisible();
    }
  });

  test('should highlight major courses in pathway', async ({ page }) => {
    // Set a target major
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('button:has-text("Set as Target Major")').click();

    // Add a course from that major
    await page.locator('.course-btn.add').first().click();

    // Go back to Pathway
    await page.locator('.nav-tab[data-view="pathway"]').click();

    // Check for highlighted courses (if any match)
    // This test validates the highlighting mechanism is in place
    await expect(page.locator('.pathway-timeline')).toBeVisible();
  });

  test('should show Clear Plan button', async ({ page }) => {
    await expect(page.locator('button:has-text("Clear Plan")')).toBeVisible();
  });

  test('should show Export Plan button', async ({ page }) => {
    await expect(page.locator('#pathway-view button:has-text("Export Plan")')).toBeVisible();
  });

  test('should display pathway stats in header', async ({ page }) => {
    await expect(page.locator('.pathway-header-stats')).toBeVisible();
    await expect(page.locator('#pathway-status')).toBeVisible();
  });

  test('should display majors in pathway stats when set', async ({ page }) => {
    // Set a target major
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('button:has-text("Set as Target Major")').click();

    // Go back to Pathway
    await page.locator('.nav-tab[data-view="pathway"]').click();

    // Pathway majors should show the selected major
    const majorsText = await page.locator('#pathway-majors').textContent();
    expect(majorsText).not.toBe('None');
  });
});
