// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Cohort Selection & Finance Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show finance choice modal for Philadelphia cohort', async ({ page }) => {
    await page.locator('[data-cohort="philadelphia"]').click();

    // Finance modal should appear
    await expect(page.locator('#finance-choice-modal')).toBeVisible();
    await expect(page.locator('.finance-modal-content h2')).toContainText('Choose Your Corporate Finance Course');

    // Should show both options
    await expect(page.locator('.finance-option-card')).toHaveCount(2);
  });

  test('should show finance choice modal for San Francisco cohort', async ({ page }) => {
    await page.locator('[data-cohort="san_francisco"]').click();

    // Finance modal should appear
    await expect(page.locator('#finance-choice-modal')).toBeVisible();
  });

  test('should NOT show finance modal for Global cohort', async ({ page }) => {
    await page.locator('[data-cohort="global"]').click();

    // Finance modal should NOT appear
    await expect(page.locator('#finance-choice-modal')).not.toBeVisible();

    // Should go directly to main app
    await expect(page.locator('#main-app')).toHaveClass(/active/);
  });

  test('should proceed to dashboard when selecting FNCE-6110', async ({ page }) => {
    await page.locator('[data-cohort="philadelphia"]').click();
    await expect(page.locator('#finance-choice-modal')).toBeVisible();

    // Click FNCE-6110 option
    await page.locator('.finance-option-card').first().click();

    // Should proceed to main app
    await expect(page.locator('#finance-choice-modal')).not.toBeVisible();
    await expect(page.locator('#main-app')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#\/dashboard/);
  });

  test('should proceed to dashboard when selecting FNCE-6210', async ({ page }) => {
    await page.locator('[data-cohort="san_francisco"]').click();
    await expect(page.locator('#finance-choice-modal')).toBeVisible();

    // Click FNCE-6210 option (second card)
    await page.locator('.finance-option-card').nth(1).click();

    // Should proceed to main app
    await expect(page.locator('#finance-choice-modal')).not.toBeVisible();
    await expect(page.locator('#main-app')).toHaveClass(/active/);
  });

  test('should close finance modal on backdrop click', async ({ page }) => {
    await page.locator('[data-cohort="philadelphia"]').click();
    await expect(page.locator('#finance-choice-modal')).toBeVisible();

    // Click backdrop
    await page.locator('#finance-choice-modal .modal-backdrop').click();

    // Modal should close
    await expect(page.locator('#finance-choice-modal')).not.toBeVisible();

    // Should still be on landing page
    await expect(page.locator('#cohort-selection')).toBeVisible();
  });

  test('should persist cohort selection in localStorage', async ({ page }) => {
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Check localStorage
    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('wemba-pathway-state');
      return saved ? JSON.parse(saved) : null;
    });

    expect(state.selectedCohort).toBe('global');
    expect(state.financeChoice).toBe('FNCE-6110');
  });

  test('should persist finance choice in localStorage', async ({ page }) => {
    await page.locator('[data-cohort="philadelphia"]').click();
    await page.locator('.finance-option-card').nth(1).click(); // FNCE-6210

    // Check localStorage
    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('wemba-pathway-state');
      return saved ? JSON.parse(saved) : null;
    });

    expect(state.selectedCohort).toBe('philadelphia');
    expect(state.financeChoice).toBe('FNCE-6210');
  });

  test('should display correct cohort name after selection', async ({ page }) => {
    await page.locator('[data-cohort="san_francisco"]').click();
    await page.locator('.finance-option-card').first().click();

    // Check cohort display
    await expect(page.locator('#current-cohort-name')).toContainText('San Francisco');
    await expect(page.locator('#cohort-icon-display')).toContainText('SF');
  });

  test('should hide finance decision card for Global cohort', async ({ page }) => {
    await page.locator('[data-cohort="global"]').click();
    await expect(page.locator('#main-app')).toHaveClass(/active/);

    // Finance decision card should be hidden
    await expect(page.locator('#finance-decision-card')).not.toBeVisible();
  });

  test('should show finance decision card for PHL cohort', async ({ page }) => {
    await page.locator('[data-cohort="philadelphia"]').click();
    await page.locator('.finance-option-card').first().click();

    // Finance decision card should be visible
    await expect(page.locator('#finance-decision-card')).toBeVisible();
  });
});
