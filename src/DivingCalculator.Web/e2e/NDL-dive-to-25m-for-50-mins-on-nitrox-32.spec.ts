import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test('NDL dive to 25m for 50 mins on nitrox 32', async ({ page }) => {
  const homePage = await new HomePage(page).goto();

  const newDivePage = await homePage.planADive();

  await newDivePage.selectStandardGas('Nitrox 32');
  expect(await newDivePage.getMaxDepthPO2()).toBe('33m (40m deco)');
  expect(await newDivePage.getMaxDepthEND()).toBe('30m');
  expect(await newDivePage.getMinDepthHypoxia()).toBe('0m');

  let diveOverviewPage = await newDivePage.Save();
  const addDiveSegmentPage = await diveOverviewPage.addSegment();
  expect(await addDiveSegmentPage.getCurrentDepth()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentCeiling()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentGas()).toBe('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthPO2()).toBe('33m (40m deco)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthEND()).toBe('30m');
  expect(await addDiveSegmentPage.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentPO2()).toBe('0.32');
  expect(await addDiveSegmentPage.getCurrentEND()).toBe('0m');

  await addDiveSegmentPage.setNewDepth(25);
  expect(await addDiveSegmentPage.getDescentTime()).toBe('1 min 15 sec @ 20m/min');
  expect(await addDiveSegmentPage.getNewDepthPO2()).toBe('1.12');
  expect(await addDiveSegmentPage.getNewDepthEND()).toBe('26m');

  expect(await addDiveSegmentPage.getNewGasPO2()).toBe('1.12');
  expect(await addDiveSegmentPage.getNewGasEND()).toBe('26m');
  expect(await addDiveSegmentPage.getNewGasNoDecoLimit()).toBe('57 min 4 sec');
  expect(await addDiveSegmentPage.getNewGasMaxDepthPO2()).toBe('33m (40m deco)');
  expect(await addDiveSegmentPage.getNewGasMaxDepthEND()).toBe('30m');
  expect(await addDiveSegmentPage.getNewGasMinDepthHypoxia()).toBe('0m');

  await addDiveSegmentPage.setTimeAtDepth(50);
  expect(await addDiveSegmentPage.getFinalCeiling()).toBe('0m');
  expect(await addDiveSegmentPage.getTotalDiveDuration()).toBe('51 min 15 sec');

  diveOverviewPage = await addDiveSegmentPage.Save();

  const diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect(diveSegments[0].details).toBe('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  expect(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 25m');
  expect(diveSegments[1].details).toBe('Descent time: 1 min 15 sec @ 20m/min');
  expect(diveSegments[2].heading).toBe('done 51:15 Surface');
  expect(diveSegments[2].details).toBe('Ascent time: 2 min 30 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('53 min 45 sec');
  expect(await diveOverviewPage.getMaxDepth()).toBe('25m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('24m');
});
