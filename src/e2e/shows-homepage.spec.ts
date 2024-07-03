import { test, expect } from 'e2e/_shared/app-fixtures';

test('shows homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/DiveIntelligence/);
});
