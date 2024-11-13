import { test, expect } from 'e2e/_shared/app-fixtures';
import { HomePage } from './pages/home.page';

test('NDL dive to 25m for 50 mins on nitrox 32', async ({ page }) => {
  const homePage = await new HomePage(page).goto();

  const newDivePage = await homePage.planADive();

  await newDivePage.selectStandardGas('Nitrox 32');
  expect.soft(await newDivePage.getMaxDepthPO2()).toBe('33m (40m deco)');
  expect.soft(await newDivePage.getMaxDepthEND()).toBe('30m');
  expect.soft(await newDivePage.getMinDepthHypoxia()).toBe('0m');

  let diveOverviewPage = await newDivePage.Save();
  const changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect.soft(await changeDepthPage.currentStats.getCurrentDepth()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getNoDecoLimit()).toBe('> 5 hours');
  expect.soft(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getCurrentGas()).toBe('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('33m (40m deco)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect.soft(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getCurrentPO2()).toBe('0.32');
  expect.soft(await changeDepthPage.currentStats.getCurrentEND()).toBe('0m');

  await changeDepthPage.setNewDepth(25);
  expect.soft(await changeDepthPage.getDescentTime()).toBe('1 min 15 sec @ 20m/min');
  expect.soft(await changeDepthPage.getNewDepthPO2()).toBe('1.12');
  expect.soft(await changeDepthPage.getNewDepthEND()).toBe('25m');
  expect.soft(await changeDepthPage.getNewDepthNDL()).toBe('45 min 35 sec');
  expect.soft(await changeDepthPage.getNewDepthCeiling()).toBe('0m');

  diveOverviewPage = await changeDepthPage.Save();

  const maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect.soft(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('25m');
  expect.soft(await maintainDepthPage.currentStats.getNoDecoLimit()).toBe('45 min 35 sec');
  expect.soft(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('33m (40m deco)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.12');
  expect.soft(await maintainDepthPage.currentStats.getCurrentEND()).toBe('25m');

  await maintainDepthPage.setTimeAtDepth(45);
  expect.soft(await maintainDepthPage.getTotalDiveDuration()).toBe('46 min 15 sec');
  expect.soft(await maintainDepthPage.getNewNDL()).toBe('35 sec');
  expect.soft(await maintainDepthPage.getNewCeiling()).toBe('1m');

  diveOverviewPage = await maintainDepthPage.Save();

  const diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect.soft(diveSegments[0].details).toBe('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  expect.soft(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 25m');
  expect.soft(diveSegments[1].details).toBe('Descent time: 1 min 15 sec @ 20m/min');
  expect.soft(diveSegments[2].heading).toBe('arrow_forward 1:15 Maintain Depth at 25m');
  expect.soft(diveSegments[2].details).toBe('Time: 45 min');
  expect.soft(diveSegments[3].heading).toBe('done 46:15 Surface');
  expect.soft(diveSegments[3].details).toBe('Ascent time: 2 min 30 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('48 min 45 sec');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('25m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('24m');

  const diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors).toHaveLength(0);
});
