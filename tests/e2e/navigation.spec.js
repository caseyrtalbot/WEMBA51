// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display landing page on initial load', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#cohort-selection')).toBeVisible();
    await expect(page.locator('.hero-title')).toContainText('WEMBA Pathway Planner');
  });

  test('should show cohort cards on landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.cohort-card')).toHaveCount(3);
    await expect(page.locator('[data-cohort="philadelphia"]')).toBeVisible();
    await expect(page.locator('[data-cohort="san_francisco"]')).toBeVisible();
    await expect(page.locator('[data-cohort="global"]')).toBeVisible();
  });

  test('should navigate to dashboard after selecting Global cohort', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-cohort="global"]').click();

    // Wait for main app to be visible
    await expect(page.locator('#main-app')).toHaveClass(/active/);
    await expect(page.locator('#dashboard-view')).toHaveClass(/active/);

    // URL should update
    await expect(page).toHaveURL(/#\/dashboard/);
  });

  test('should navigate between views using sidebar', async ({ page }) => {
    // Setup: select cohort first
    await page.goto('/');
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Navigate to Explorer
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await expect(page.locator('#explorer-view')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#\/explorer/);

    // Navigate to Pathway
    await page.locator('.nav-tab[data-view="pathway"]').click();
    await expect(page.locator('#pathway-view')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#\/pathway/);

    // Navigate to Graph Builder
    await page.locator('.nav-tab[data-view="graph"]').click();
    await expect(page.locator('#graph-view')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#\/graph/);

    // Navigate back to Dashboard
    await page.locator('.nav-tab[data-view="dashboard"]').click();
    await expect(page.locator('#dashboard-view')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#\/dashboard/);
  });

  test('should handle browser back/forward buttons', async ({ page }) => {
    // Setup: select cohort first
    await page.goto('/');
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Navigate through views
    await page.locator('.nav-tab[data-view="explorer"]').click();
    await expect(page).toHaveURL(/#\/explorer/);

    await page.locator('.nav-tab[data-view="pathway"]').click();
    await expect(page).toHaveURL(/#\/pathway/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/#\/explorer/);
    await expect(page.locator('#explorer-view')).toHaveClass(/active/);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/#\/pathway/);
    await expect(page.locator('#pathway-view')).toHaveClass(/active/);
  });

  test('should redirect to landing if no cohort selected when accessing app routes', async ({ page }) => {
    // Try to access dashboard directly without cohort
    await page.goto('/#/dashboard');

    // Should redirect to landing page
    await expect(page.locator('#cohort-selection')).toBeVisible();
  });

  test('should restore view when URL is bookmarked', async ({ page }) => {
    // First, select a cohort and navigate
    await page.goto('/');
    await page.locator('[data-cohort="global"]').click();
    await page.locator('.nav-tab[data-view="pathway"]').click();
    await expect(page).toHaveURL(/#\/pathway/);

    // Now reload the page (simulating bookmark)
    await page.reload();

    // Should restore the pathway view
    await expect(page.locator('#pathway-view')).toHaveClass(/active/);
  });

  test('should show cohort switcher and allow switching back to landing', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Click cohort switcher
    await page.locator('#cohort-switcher').click();

    // Should show landing page
    await expect(page.locator('#cohort-selection')).toBeVisible();
    await expect(page).toHaveURL(/#\//);
  });
});
