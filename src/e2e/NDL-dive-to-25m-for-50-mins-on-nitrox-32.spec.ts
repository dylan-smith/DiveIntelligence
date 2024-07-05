import { test, expect } from 'e2e/_shared/app-fixtures';
import { HomePage } from './pages/home.page';

test('NDL dive to 25m for 50 mins on nitrox 32', async ({ page }) => {
  const homePage = await new HomePage(page).goto();

  const newDivePage = await homePage.planADive();

  await newDivePage.selectStandardGas('Nitrox 32');
  expect(await newDivePage.getMaxDepthPO2()).toBe('33m (40m deco)');
  expect(await newDivePage.getMaxDepthEND()).toBe('30m');
  expect(await newDivePage.getMinDepthHypoxia()).toBe('0m');

  let diveOverviewPage = await newDivePage.Save();
  const changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect(await changeDepthPage.getCurrentDepth()).toBe('0m');
  expect(await changeDepthPage.getCurrentCeiling()).toBe('0m');
  expect(await changeDepthPage.getCurrentGas()).toBe('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  expect(await changeDepthPage.getCurrentMaxDepthPO2()).toBe('33m (40m deco)');
  expect(await changeDepthPage.getCurrentMaxDepthEND()).toBe('30m');
  expect(await changeDepthPage.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await changeDepthPage.getCurrentPO2()).toBe('0.32');
  expect(await changeDepthPage.getCurrentEND()).toBe('0m');

  await changeDepthPage.setNewDepth(25);
  expect(await changeDepthPage.getDescentTime()).toBe('1 min 15 sec @ 20m/min');
  expect(await changeDepthPage.getNewDepthPO2()).toBe('1.12');
  expect(await changeDepthPage.getNewDepthEND()).toBe('25m');

  diveOverviewPage = await changeDepthPage.Save();

  const maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect(await maintainDepthPage.getCurrentDepth()).toBe('25m');
  expect(await maintainDepthPage.getCurrentCeiling()).toBe('0m');
  expect(await maintainDepthPage.getCurrentGas()).toBe('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  expect(await maintainDepthPage.getCurrentMaxDepthPO2()).toBe('33m (40m deco)');
  expect(await maintainDepthPage.getCurrentMaxDepthEND()).toBe('30m');
  expect(await maintainDepthPage.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await maintainDepthPage.getCurrentPO2()).toBe('1.12');
  expect(await maintainDepthPage.getCurrentEND()).toBe('25m');

  await maintainDepthPage.setTimeAtDepth(50);
  expect(await maintainDepthPage.getFinalCeiling()).toBe('0m');
  expect(await maintainDepthPage.getTotalDiveDuration()).toBe('51 min 15 sec');

  diveOverviewPage = await maintainDepthPage.Save();

  const diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect(diveSegments[0].details).toBe('Nitrox 32 (O2: 32%, He: 0%, N2: 68%)');
  expect(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 25m');
  expect(diveSegments[1].details).toBe('Descent time: 1 min 15 sec @ 20m/min');
  expect(diveSegments[2].heading).toBe('arrow_forward 1:15 Maintain Depth at 25m');
  expect(diveSegments[2].details).toBe('Time: 50 min');
  expect(diveSegments[3].heading).toBe('done 51:15 Surface');
  expect(diveSegments[3].details).toBe('Ascent time: 2 min 30 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('53 min 45 sec');
  expect(await diveOverviewPage.getMaxDepth()).toBe('25m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('24m');
});
