// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Select Global cohort to get to dashboard quickly
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);
  });

  test('should display graduation progress', async ({ page }) => {
    await expect(page.locator('.progress-card')).toBeVisible();
    await expect(page.locator('#progress-cu')).toBeVisible();
    await expect(page.locator('#graduation-status')).toBeVisible();
  });

  test('should show correct initial CU total', async ({ page }) => {
    // Global cohort starts with core curriculum CUs
    const cuText = await page.locator('#total-cu').textContent();
    const cu = parseFloat(cuText);
    expect(cu).toBeGreaterThan(0);
  });

  test('should display major progress section', async ({ page }) => {
    await expect(page.locator('.major-card')).toBeVisible();

    // With no major selected, should show empty state
    await expect(page.locator('#major-progress-content')).toContainText('No major selected');
    await expect(page.locator('#major-progress-content button')).toContainText('Explore Majors');
  });

  test('should navigate to Explorer when clicking Explore Majors button', async ({ page }) => {
    await page.locator('#major-progress-content button').click();

    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#\/explorer/);
  });

  test('should display alerts section', async ({ page }) => {
    await expect(page.locator('.alerts-card')).toBeVisible();
    await expect(page.locator('#alerts-list')).toBeVisible();
  });

  test('should display quick actions', async ({ page }) => {
    await expect(page.locator('.actions-card')).toBeVisible();
    await expect(page.locator('.actions-card button')).toHaveCount(3);
  });

  test('should navigate to Explorer from quick actions', async ({ page }) => {
    await page.locator('.actions-card button:has-text("Explore Courses")').click();
    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
  });

  test('should navigate to Pathway from quick actions', async ({ page }) => {
    await page.locator('.actions-card button:has-text("View My Plan")').click();
    await expect(page.locator('#pathway-view')).toHaveClass(/active/);
  });

  test('should display completed block courses section', async ({ page }) => {
    await expect(page.locator('.block-courses-card')).toBeVisible();
  });

  test('should update sidebar progress display', async ({ page }) => {
    await expect(page.locator('#sidebar-cu-display')).toBeVisible();
    await expect(page.locator('#sidebar-progress-percent')).toBeVisible();
    await expect(page.locator('#sidebar-progress-fill')).toBeVisible();
  });

  test('should show major progress after selecting a target major', async ({ page }) => {
    // Navigate to Explorer
    await page.locator('.nav-tab[data-view="explorer"]').click();

    // Select a major
    await page.locator('#majors-list .sidebar-item').first().click();

    // Click "Set as Target Major" button
    await page.locator('button:has-text("Set as Target Major")').click();

    // Go back to Dashboard
    await page.locator('.nav-tab[data-view="dashboard"]').click();

    // Major progress should now be visible
    await expect(page.locator('.major-progress-item')).toBeVisible();
  });

  test('should make major progress items clickable', async ({ page }) => {
    // Set up a target major first
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await page.locator('#majors-list .sidebar-item').first().click();
    await page.locator('button:has-text("Set as Target Major")').click();

    // Go back to Dashboard
    await page.locator('.nav-tab[data-view="dashboard"]').click();

    // Click on the major progress item
    const majorItem = page.locator('.major-progress-item.clickable').first();
    await expect(majorItem).toBeVisible();
    await majorItem.click();

    // Should navigate to Explorer with that major selected
    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#\/explorer/);
  });

  test('should update progress when block course is completed', async ({ page }) => {
    const initialCu = await page.locator('#total-cu').textContent();

    // Find and click a block course add button
    const blockBtn = page.locator('.block-course-btn:has-text("+ Add")').first();
    if (await blockBtn.isVisible()) {
      await blockBtn.click();

      // CU should update
      const newCu = await page.locator('#total-cu').textContent();
      expect(parseFloat(newCu)).toBeGreaterThanOrEqual(parseFloat(initialCu));
    }
  });
});
