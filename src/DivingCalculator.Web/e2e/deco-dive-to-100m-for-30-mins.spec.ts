import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';

test('deco dive to 100m for 30 mins', async ({ page }) => {
  const homePage = await new HomePage(page).goto();

  const newDivePage = await homePage.planADive();

  await newDivePage.selectStandardGas('Nitrox 50');
  expect(await newDivePage.getMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await newDivePage.getMaxDepthEND()).toBe('30m');
  expect(await newDivePage.getMinDepthHypoxia()).toBe('0m');

  // add 1st segment
  let diveOverviewPage = await newDivePage.Save();
  let addDiveSegmentPage = await diveOverviewPage.addSegment();
  expect(await addDiveSegmentPage.getCurrentDepth()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentCeiling()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthEND()).toBe('30m');
  expect(await addDiveSegmentPage.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentPO2()).toBe('0.50');
  expect(await addDiveSegmentPage.getCurrentEND()).toBe('0m');

  await addDiveSegmentPage.setNewDepth(18);
  expect(await addDiveSegmentPage.getDescentTime()).toBe('54 sec @ 20m/min');
  expect(await addDiveSegmentPage.getNewDepthPO2()).toBe('1.40');
  expect(await addDiveSegmentPage.getNewDepthEND()).toBe('18m');

  await addDiveSegmentPage.selectStandardGas('Trimix 10/70');
  expect(await addDiveSegmentPage.getNewGasPO2()).toBe('0.28');
  expect(await addDiveSegmentPage.getNewGasEND()).toBe('0m');
  expect(await addDiveSegmentPage.getNewGasNoDecoLimit()).toBe('44 min 44 sec');
  expect(await addDiveSegmentPage.getNewGasMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await addDiveSegmentPage.getNewGasMaxDepthEND()).toBe('123m');
  expect(await addDiveSegmentPage.getNewGasMinDepthHypoxia()).toBe('8m');

  await addDiveSegmentPage.setTimeAtDepth(1);
  expect(await addDiveSegmentPage.getFinalCeiling()).toBe('0m');
  expect(await addDiveSegmentPage.getTotalDiveDuration()).toBe('1 min 54 sec');

  diveOverviewPage = await addDiveSegmentPage.Save();

  let diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect(diveSegments[0].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 18m');
  expect(diveSegments[1].details).toBe('Descent time: 54 sec @ 20m/min');
  expect(diveSegments[2].heading).toBe('air 0:54 Switch Gas');
  expect(diveSegments[2].details).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(diveSegments[3].heading).toBe('done 1:54 Surface');
  expect(diveSegments[3].details).toBe('Ascent time: 1 min 48 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('3 min 42 sec');
  expect(await diveOverviewPage.getMaxDepth()).toBe('18m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('11m');

  let diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors[0]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 2nd segment
  addDiveSegmentPage = await diveOverviewPage.addSegment();
  expect(await addDiveSegmentPage.getCurrentDepth()).toBe('18m');
  expect(await addDiveSegmentPage.getCurrentCeiling()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthEND()).toBe('123m');
  expect(await addDiveSegmentPage.getCurrentMinDepthHypoxia()).toBe('8m');
  expect(await addDiveSegmentPage.getCurrentPO2()).toBe('0.28');
  expect(await addDiveSegmentPage.getCurrentEND()).toBe('0m');

  await addDiveSegmentPage.setNewDepth(100);
  expect(await addDiveSegmentPage.getDescentTime()).toBe('4 min 6 sec @ 20m/min');
  expect(await addDiveSegmentPage.getNewDepthPO2()).toBe('1.10');
  expect(await addDiveSegmentPage.getNewDepthEND()).toBe('24m');

  expect(await addDiveSegmentPage.getNewGasPO2()).toBe('1.10');
  expect(await addDiveSegmentPage.getNewGasEND()).toBe('24m');
  expect(await addDiveSegmentPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect(await addDiveSegmentPage.getNewGasMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await addDiveSegmentPage.getNewGasMaxDepthEND()).toBe('123m');
  expect(await addDiveSegmentPage.getNewGasMinDepthHypoxia()).toBe('8m');

  await addDiveSegmentPage.setTimeAtDepth(30);
  expect(await addDiveSegmentPage.getFinalCeiling()).toBe('49m');
  expect(await addDiveSegmentPage.getTotalDiveDuration()).toBe('37 min 48 sec');

  diveOverviewPage = await addDiveSegmentPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[3].heading).toBe('arrow_downward 1:54 Descend to 100m');
  expect(diveSegments[3].details).toBe('Descent time: 4 min 6 sec @ 20m/min');
  expect(diveSegments[4].heading).toBe('done 36:00 Surface');
  expect(diveSegments[4].details).toBe('Ascent time: 10 min @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('46 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('82m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 34.2m for 4 min 17 sec');
  expect(diveErrors[1]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 3rd segment
  addDiveSegmentPage = await diveOverviewPage.addSegment();
  expect(await addDiveSegmentPage.getCurrentDepth()).toBe('100m');
  expect(await addDiveSegmentPage.getCurrentCeiling()).toBe('49m');
  expect(await addDiveSegmentPage.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthEND()).toBe('123m');
  expect(await addDiveSegmentPage.getCurrentMinDepthHypoxia()).toBe('8m');
  expect(await addDiveSegmentPage.getCurrentPO2()).toBe('1.10');
  expect(await addDiveSegmentPage.getCurrentEND()).toBe('24m');

  await addDiveSegmentPage.setNewDepth(43);
  expect(await addDiveSegmentPage.getAscentTime()).toBe('5 min 42 sec @ 10m/min');
  expect(await addDiveSegmentPage.getNewDepthPO2()).toBe('0.53');
  expect(await addDiveSegmentPage.getNewDepthEND()).toBe('6m');

  expect(await addDiveSegmentPage.getOptimalDecoGas()).toBe('Custom (O2: 30%, He: 25%, N2: 45%)');
  await addDiveSegmentPage.selectOptimalDecoGas();
  expect(await addDiveSegmentPage.getNewGasPO2()).toBe('1.59');
  expect(await addDiveSegmentPage.isNewGasPO2Warning()).toBe(true);
  expect(await addDiveSegmentPage.getNewGasEND()).toBe('30m');
  expect(await addDiveSegmentPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect(await addDiveSegmentPage.getNewGasMaxDepthPO2()).toBe('36m (43m deco)');
  expect(await addDiveSegmentPage.getNewGasMaxDepthEND()).toBe('43m');
  expect(await addDiveSegmentPage.getNewGasMinDepthHypoxia()).toBe('0m');

  await addDiveSegmentPage.setTimeAtDepth(20);
  expect(await addDiveSegmentPage.getFinalCeiling()).toBe('23m');
  expect(await addDiveSegmentPage.getTotalDiveDuration()).toBe('71 min 42 sec');

  let decoMilestones = await addDiveSegmentPage.getDecoMilestones();
  expect(decoMilestones[0]).toBe('3 min 45 sec : Helitrox 35/25 @ 35m');
  expect(decoMilestones[1]).toBe('8 min 8 sec : Air @ 30m');
  expect(decoMilestones[2]).toBe('8 min 9 sec : Nitrox 32 @ 30m'); // TODO: this is a bug, should be the same time as air
  expect(decoMilestones[3]).toBe('20 min 25 sec : Nitrox 50 @ 22m');

  diveOverviewPage = await addDiveSegmentPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[4].heading).toBe('arrow_upward 36:00 Ascend to 43m');
  expect(diveSegments[4].details).toBe('Ascent time: 5 min 42 sec @ 10m/min');
  expect(diveSegments[5].heading).toBe('air 41:42 Switch Gas');
  expect(diveSegments[5].details).toBe('Custom (O2: 30%, He: 25%, N2: 45%)');
  expect(diveSegments[6].heading).toBe('done 1:01:42 Surface');
  expect(diveSegments[6].details).toBe('Ascent time: 4 min 18 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('66 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('70m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 19.3m for 2 min 6 sec');

  // add 4th segment
  addDiveSegmentPage = await diveOverviewPage.addSegment();
  expect(await addDiveSegmentPage.getCurrentDepth()).toBe('43m');
  expect(await addDiveSegmentPage.getCurrentCeiling()).toBe('23m');
  expect(await addDiveSegmentPage.getCurrentGas()).toBe('Custom (O2: 30%, He: 25%, N2: 45%)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthPO2()).toBe('36m (43m deco)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthEND()).toBe('43m');
  expect(await addDiveSegmentPage.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentPO2()).toBe('1.59');
  expect(await addDiveSegmentPage.isCurrentPO2Warning()).toBe(true);
  expect(await addDiveSegmentPage.getCurrentEND()).toBe('30m');

  await addDiveSegmentPage.setNewDepth(22);
  expect(await addDiveSegmentPage.getAscentTime()).toBe('2 min 6 sec @ 10m/min');
  expect(await addDiveSegmentPage.getNewDepthPO2()).toBe('0.96');
  expect(await addDiveSegmentPage.getNewDepthEND()).toBe('15m');

  expect(await addDiveSegmentPage.getOptimalDecoGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  await addDiveSegmentPage.selectOptimalDecoGas();
  expect(await addDiveSegmentPage.getNewGasPO2()).toBe('1.60');
  expect(await addDiveSegmentPage.isNewGasPO2Warning()).toBe(true);
  expect(await addDiveSegmentPage.getNewGasEND()).toBe('22m');
  expect(await addDiveSegmentPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect(await addDiveSegmentPage.getNewGasMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await addDiveSegmentPage.getNewGasMaxDepthEND()).toBe('30m');
  expect(await addDiveSegmentPage.getNewGasMinDepthHypoxia()).toBe('0m');

  await addDiveSegmentPage.setTimeAtDepth(41);
  expect(await addDiveSegmentPage.getFinalCeiling()).toBe('7m');
  expect(await addDiveSegmentPage.getTotalDiveDuration()).toBe('109 min 6 sec');

  decoMilestones = await addDiveSegmentPage.getDecoMilestones();
  expect(decoMilestones[0]).toBe('41 min 39 sec : Oxygen @ 6m');

  diveOverviewPage = await addDiveSegmentPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[6].heading).toBe('arrow_upward 1:01:42 Ascend to 22m');
  expect(diveSegments[6].details).toBe('Ascent time: 2 min 6 sec @ 10m/min');
  expect(diveSegments[7].heading).toBe('air 1:03:48 Switch Gas');
  expect(diveSegments[7].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(diveSegments[8].heading).toBe('done 1:44:48 Surface');
  expect(diveSegments[8].details).toBe('Ascent time: 2 min 12 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('107 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('52m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 5.5m for 34 sec');

  // add 5th segment
  addDiveSegmentPage = await diveOverviewPage.addSegment();
  expect(await addDiveSegmentPage.getCurrentDepth()).toBe('22m');
  expect(await addDiveSegmentPage.getCurrentCeiling()).toBe('7m');
  expect(await addDiveSegmentPage.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await addDiveSegmentPage.getCurrentMaxDepthEND()).toBe('30m');
  expect(await addDiveSegmentPage.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await addDiveSegmentPage.getCurrentPO2()).toBe('1.60');
  expect(await addDiveSegmentPage.isCurrentPO2Warning()).toBe(true);
  expect(await addDiveSegmentPage.getCurrentEND()).toBe('22m');

  await addDiveSegmentPage.setNewDepth(6);
  expect(await addDiveSegmentPage.getAscentTime()).toBe('1 min 36 sec @ 10m/min');
  expect(await addDiveSegmentPage.getNewDepthPO2()).toBe('0.80');
  expect(await addDiveSegmentPage.getNewDepthEND()).toBe('7m');

  expect(await addDiveSegmentPage.getOptimalDecoGas()).toBe('Oxygen (O2: 100%, He: 0%, N2: 0%)');
  await addDiveSegmentPage.selectCustomGas(100, 0);
  expect(await addDiveSegmentPage.getNewGasPO2()).toBe('1.60');
  expect(await addDiveSegmentPage.isNewGasPO2Warning()).toBe(true);
  expect(await addDiveSegmentPage.getNewGasEND()).toBe('7m'); // TODO: this is a bug, should be 6m
  expect(await addDiveSegmentPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect(await addDiveSegmentPage.getNewGasMaxDepthPO2()).toBe('4m (6m deco)');
  expect(await addDiveSegmentPage.getNewGasMaxDepthEND()).toBe('30m');
  expect(await addDiveSegmentPage.getNewGasMinDepthHypoxia()).toBe('0m');

  await addDiveSegmentPage.setTimeAtDepth(33);
  expect(await addDiveSegmentPage.getFinalCeiling()).toBe('1m');
  expect(await addDiveSegmentPage.getTotalDiveDuration()).toBe('141 min 36 sec');

  decoMilestones = await addDiveSegmentPage.getDecoMilestones();
  expect(decoMilestones[0]).toBe('33 min 3 sec : Deco complete @ 0m');

  diveOverviewPage = await addDiveSegmentPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[8].heading).toBe('arrow_upward 1:44:48 Ascend to 6m');
  expect(diveSegments[8].details).toBe('Ascent time: 1 min 36 sec @ 10m/min');
  expect(diveSegments[9].heading).toBe('air 1:46:24 Switch Gas');
  expect(diveSegments[9].details).toBe('Oxygen (O2: 100%, He: 0%, N2: 0%)');
  expect(diveSegments[10].heading).toBe('done 2:19:24 Surface');
  expect(diveSegments[10].details).toBe('Ascent time: 36 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('140 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('41m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors).toHaveLength(0);
});
