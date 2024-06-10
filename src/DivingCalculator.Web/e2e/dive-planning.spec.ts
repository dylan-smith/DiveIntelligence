import { test, expect } from '@playwright/test';

test('shows homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/DiveIntelligence/);
});

test('NDL dive to 25m for 50 mins on nitrox 32', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Plan a Dive' }).click();

  await page.getByText('Nitrox 32').click();
  await expect(page.locator('dive-start-gas-stats .gas-calculations .gas-calc').getByText('Max Depth (PO2): 33m (40m deco)')).toBeVisible();
  await expect(page.locator('dive-start-gas-stats .gas-calculations .gas-calc').getByText('Max Depth (END): 30m')).toBeVisible();
  await expect(page.locator('dive-start-gas-stats .gas-calculations .gas-calc').getByText('Min Depth (Hypoxia): 0m')).toBeVisible();
  await page.getByRole('button', { name: 'Save' }).click();

  await page.locator('button').filter({ hasText: 'add' }).click();

  await expect(page.locator('dive-current-stats .current-stats .dive-stat').getByText('Current Depth: 0m')).toBeVisible();
  await expect(page.locator('dive-current-stats .current-stats .dive-stat').getByText('Current Ceiling: 0m')).toBeVisible();
  await expect(page.locator('dive-current-stats .current-stats .dive-stat').getByText('Current Gas: Nitrox 32 (O2: 32%, He: 0%, N2: 68%)')).toBeVisible();
  await expect(page.locator('dive-current-stats .current-stats .dive-stat').getByText('Max Depth (PO2): 33m (40m deco)')).toBeVisible();
  await expect(page.locator('dive-current-stats .current-stats .dive-stat').getByText('Max Depth (END): 30m')).toBeVisible();
  await expect(page.locator('dive-current-stats .current-stats .dive-stat').getByText('Min Depth (Hypoxia): 0m')).toBeVisible();
  await expect(page.locator('dive-current-stats .current-stats .dive-stat').getByText('PO2: 0.32')).toBeVisible();
  await expect(page.locator('dive-current-stats .current-stats .dive-stat').getByText('END: 0m')).toBeVisible();

  await page.getByLabel('New Depth (m)').fill('25');
  await expect(page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('Descent Time: 1 min 15 sec @ 20m/min')).toBeVisible();
  await expect(page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('PO2: 1.52')).toBeVisible();
  await expect(page.locator('dive-new-depth-stats .new-depth-stats .dive-stat').getByText('END: 26m')).toBeVisible();

  await expect(page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('PO2: 1.12')).toBeVisible();
  await expect(page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('END: 26m')).toBeVisible();
  await expect(page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('No Deco Limit: 57 min 4 sec')).toBeVisible();
  await expect(page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('Max Depth (PO2): 33m (40m deco)')).toBeVisible();
  await expect(page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('Max Depth (END): 30m')).toBeVisible();
  await expect(page.locator('dive-new-gas-stats .new-gas-stats .gas-calculation-chunk .dive-stat').getByText('Min Depth (Hypoxia): 0m')).toBeVisible();

  await page.getByLabel('Time at Depth (mins)').fill('50');
  await expect(page.locator('dive-new-time-stats .new-time-stats .dive-stat').getByText('Ceiling: 0m')).toBeVisible();
  await expect(page.locator('dive-new-time-stats .new-time-stats .dive-stat').getByText('Total Dive Duration: 51 min 15 sec')).toBeVisible();

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('listbox').locator('mat-list-item').first()).toContainText('scuba_diving 0:00 Start Dive');
  await expect(page.getByRole('listbox').locator('mat-list-item').first()).toContainText('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  await expect(page.getByRole('listbox').locator('mat-list-item').nth(1)).toContainText('arrow_downward 0:00 Descend to 25m');
  await expect(page.getByRole('listbox').locator('mat-list-item').nth(1)).toContainText('Descent time: 1 min 15 sec @ 20m/min');
  await expect(page.getByRole('listbox').locator('mat-list-item').nth(2)).toContainText('done 51:15 Surface');
  await expect(page.getByRole('listbox').locator('mat-list-item').nth(2)).toContainText('Ascent time: 2 min 30 sec @ 10m/min');

  await expect(page.locator('dive-dive-summary .dive-stats .dive-stat').getByText('Dive Duration: 53 min 45 sec')).toBeVisible();
  await expect(page.locator('dive-dive-summary .dive-stats .dive-stat').getByText('Max Depth: 25m')).toBeVisible();
  await expect(page.locator('dive-dive-summary .dive-stats .dive-stat').getByText('Average Depth: 24m')).toBeVisible();
});
