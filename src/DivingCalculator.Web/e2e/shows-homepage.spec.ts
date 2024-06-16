import { test, expect } from '@playwright/test';

test('shows homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/DiveIntelligence/);
});
