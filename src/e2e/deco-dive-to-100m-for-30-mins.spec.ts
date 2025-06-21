import { test, expect } from 'e2e/_shared/app-fixtures';
import { HomePage } from './pages/home.page';

test('deco dive to 100m for 30 mins', async ({ page }) => {
  const homePage = await new HomePage(page).goto();

  const newDivePage = await homePage.planADive();

  await newDivePage.selectStandardGas('Nitrox 50');
  expect.soft(await newDivePage.getMaxDepthPO2()).toBe('18m (22m deco)');
  expect.soft(await newDivePage.getMaxDepthEND()).toBe('30m');
  expect.soft(await newDivePage.getMinDepthHypoxia()).toBe('0m');

  let diveOverviewPage = await newDivePage.Save();

  // add 1st segment
  let changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect.soft(await changeDepthPage.currentStats.getCurrentDepth()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getNoDecoLimit()).toBe('> 5 hours');
  expect.soft(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect.soft(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getCurrentPO2()).toBe('0.50');
  expect.soft(await changeDepthPage.currentStats.getCurrentEND()).toBe('0m');

  await changeDepthPage.setNewDepth(18);
  expect.soft(await changeDepthPage.getDescentTime()).toBe('54 sec @ 20m/min');
  expect.soft(await changeDepthPage.getNewDepthPO2()).toBe('1.40');
  expect.soft(await changeDepthPage.getNewDepthEND()).toBe('18m');
  expect.soft(await changeDepthPage.getNewDepthNDL()).toBe('> 5 hours');
  expect.soft(await changeDepthPage.getNewDepthCeiling()).toBe('0m');

  diveOverviewPage = await changeDepthPage.Save();

  let diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect.soft(diveSegments[0].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect.soft(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 18m');
  expect.soft(diveSegments[1].details).toBe('Descent time: 54 sec @ 20m/min');
  expect.soft(diveSegments[2].heading).toBe('done 0:54 Surface');
  expect.soft(diveSegments[2].details).toBe('Ascent time: 1 min 48 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('2 min 42 sec');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('18m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('9m');

  let diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(0);

  // add 2nd segment
  let changeGasPage = await diveOverviewPage.addChangeGasSegment();
  expect.soft(await changeGasPage.currentStats.getCurrentDepth()).toBe('18m');
  expect.soft(await changeGasPage.currentStats.getNoDecoLimit()).toBe('> 5 hours');
  expect.soft(await changeGasPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect.soft(await changeGasPage.currentStats.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect.soft(await changeGasPage.currentStats.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect.soft(await changeGasPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect.soft(await changeGasPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await changeGasPage.currentStats.getCurrentPO2()).toBe('1.40');
  expect.soft(await changeGasPage.currentStats.getCurrentEND()).toBe('18m');

  await changeGasPage.selectStandardGas('Trimix 10/70');
  expect.soft(await changeGasPage.getNewGasPO2()).toBe('0.28');
  expect.soft(await changeGasPage.getNewGasEND()).toBe('0m');
  expect.soft(await changeGasPage.getNewGasNoDecoLimit()).toBe('20 min 23 sec');
  expect.soft(await changeGasPage.getNewGasMaxDepthPO2()).toBe('130m (150m deco)');
  expect.soft(await changeGasPage.getNewGasMaxDepthEND()).toBe('123m');
  expect.soft(await changeGasPage.getNewGasMinDepthHypoxia()).toBe('8m');

  diveOverviewPage = await changeGasPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect.soft(diveSegments[0].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect.soft(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 18m');
  expect.soft(diveSegments[1].details).toBe('Descent time: 54 sec @ 20m/min');
  expect.soft(diveSegments[2].heading).toBe('air 0:54 Switch Gas');
  expect.soft(diveSegments[2].details).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect.soft(diveSegments[3].heading).toBe('done 0:54 Surface');
  expect.soft(diveSegments[3].details).toBe('Ascent time: 1 min 48 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('2 min 42 sec');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('18m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('9m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 3rd segment
  let maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect.soft(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('18m');
  expect.soft(await maintainDepthPage.currentStats.getNoDecoLimit()).toBe('20 min 23 sec');
  expect.soft(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('0.28');
  expect.soft(await maintainDepthPage.currentStats.getCurrentEND()).toBe('0m');

  await maintainDepthPage.setTimeAtDepth(1);
  expect.soft(await maintainDepthPage.getTotalDiveDuration()).toBe('1 min 54 sec');
  expect.soft(await maintainDepthPage.getNewNDL()).toBe('19 min 23 sec');
  expect.soft(await maintainDepthPage.getNewCeiling()).toBe('0m');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect.soft(diveSegments[0].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect.soft(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 18m');
  expect.soft(diveSegments[1].details).toBe('Descent time: 54 sec @ 20m/min');
  expect.soft(diveSegments[2].heading).toBe('air 0:54 Switch Gas');
  expect.soft(diveSegments[2].details).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect.soft(diveSegments[3].heading).toBe('arrow_forward 0:54 Maintain Depth at 18m');
  expect.soft(diveSegments[3].details).toBe('Time: 1 min');
  expect.soft(diveSegments[4].heading).toBe('done 1:54 Surface');
  expect.soft(diveSegments[4].details).toBe('Ascent time: 1 min 48 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('3 min 42 sec');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('18m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('11m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 4th segment
  changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect.soft(await changeDepthPage.currentStats.getCurrentDepth()).toBe('18m');
  expect.soft(await changeDepthPage.currentStats.getNoDecoLimit()).toBe('19 min 23 sec');
  expect.soft(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect.soft(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect.soft(await changeDepthPage.currentStats.getCurrentPO2()).toBe('0.28');
  expect.soft(await changeDepthPage.currentStats.getCurrentEND()).toBe('0m');

  await changeDepthPage.setNewDepth(100);
  expect.soft(await changeDepthPage.getDescentTime()).toBe('4 min 6 sec @ 20m/min');
  expect.soft(await changeDepthPage.getNewDepthPO2()).toBe('1.10');
  expect.soft(await changeDepthPage.getNewDepthEND()).toBe('23m');
  expect.soft(await changeDepthPage.getNewDepthNDL()).toBe('0 sec');
  expect.soft(await changeDepthPage.getNewDepthCeiling()).toBe('14m');

  diveOverviewPage = await changeDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[4].heading).toBe('arrow_downward 1:54 Descend to 100m');
  expect.soft(diveSegments[4].details).toBe('Descent time: 4 min 6 sec @ 20m/min');
  expect.soft(diveSegments[5].heading).toBe('done 6:00 Surface');
  expect.soft(diveSegments[5].details).toBe('Ascent time: 10 min @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('16 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('48m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(2);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 11.5m for 1 min 22 sec');
  expect.soft(diveErrors[1]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 5th segment
  maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect.soft(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('100m');
  expect.soft(await maintainDepthPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('14m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.10');
  expect.soft(await maintainDepthPage.currentStats.getCurrentEND()).toBe('23m');

  await maintainDepthPage.setTimeAtDepth(30);
  expect.soft(await maintainDepthPage.getTotalDiveDuration()).toBe('36 min');
  expect.soft(await maintainDepthPage.getNewNDL()).toBe('0 sec');
  expect.soft(await maintainDepthPage.getNewCeiling()).toBe('46m');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[5].heading).toBe('arrow_forward 6:00 Maintain Depth at 100m');
  expect.soft(diveSegments[5].details).toBe('Time: 30 min');
  expect.soft(diveSegments[6].heading).toBe('done 36:00 Surface');
  expect.soft(diveSegments[6].details).toBe('Ascent time: 10 min @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('46 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('82m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(2);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 37.2m for 4 min 32 sec');
  expect.soft(diveErrors[1]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 6th segment
  changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect.soft(await changeDepthPage.currentStats.getCurrentDepth()).toBe('100m');
  expect.soft(await changeDepthPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('46m');
  expect.soft(await changeDepthPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect.soft(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect.soft(await changeDepthPage.currentStats.getCurrentPO2()).toBe('1.10');
  expect.soft(await changeDepthPage.currentStats.getCurrentEND()).toBe('23m');

  await changeDepthPage.setNewDepth(46);
  expect.soft(await changeDepthPage.getAscentTime()).toBe('5 min 24 sec @ 10m/min');
  expect.soft(await changeDepthPage.getNewDepthPO2()).toBe('0.56');
  expect.soft(await changeDepthPage.getNewDepthEND()).toBe('7m');
  expect.soft(await changeDepthPage.getNewDepthNDL()).toBe('0 sec');
  expect.soft(await changeDepthPage.getNewDepthCeiling()).toBe('46m');

  diveOverviewPage = await changeDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[6].heading).toBe('arrow_upward 36:00 Ascend to 46m');
  expect.soft(diveSegments[6].details).toBe('Ascent time: 5 min 24 sec @ 10m/min');
  expect.soft(diveSegments[7].heading).toBe('done 41:24 Surface');
  expect.soft(diveSegments[7].details).toBe('Ascent time: 4 min 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('46 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('82m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(2);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 37.2m for 4 min 32 sec');
  expect.soft(diveErrors[1]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 7th segment
  changeGasPage = await diveOverviewPage.addChangeGasSegment();
  expect.soft(await changeGasPage.currentStats.getCurrentDepth()).toBe('46m');
  expect.soft(await changeGasPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeGasPage.currentStats.getCurrentCeiling()).toBe('46m');
  expect.soft(await changeGasPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect.soft(await changeGasPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect.soft(await changeGasPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect.soft(await changeGasPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect.soft(await changeGasPage.currentStats.getCurrentPO2()).toBe('0.56');
  expect.soft(await changeGasPage.currentStats.getCurrentEND()).toBe('7m');

  expect.soft(await changeGasPage.getOptimalDecoGas()).toBe('Custom (O2: 28%, He: 29%, N2: 43%)');
  await changeGasPage.selectOptimalDecoGas();
  expect.soft(await changeGasPage.getNewGasPO2()).toBe('1.57');
  expect.soft(await changeGasPage.isNewGasPO2Warning()).toBe(true);
  expect.soft(await changeGasPage.getNewGasEND()).toBe('30m');
  expect.soft(await changeGasPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeGasPage.getNewGasMaxDepthPO2()).toBe('40m (47m deco)');
  expect.soft(await changeGasPage.getNewGasMaxDepthEND()).toBe('46m');
  expect.soft(await changeGasPage.getNewGasMinDepthHypoxia()).toBe('0m');

  diveOverviewPage = await changeGasPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[7].heading).toBe('air 41:24 Switch Gas');
  expect.soft(diveSegments[7].details).toBe('Custom (O2: 28%, He: 29%, N2: 43%)');
  expect.soft(diveSegments[8].heading).toBe('done 41:24 Surface');
  expect.soft(diveSegments[8].details).toBe('Ascent time: 4 min 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('46 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('82m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 35.7m for 4 min 32 sec');

  // add 8th segment
  maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect.soft(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('46m');
  expect.soft(await maintainDepthPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('46m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Custom (O2: 28%, He: 29%, N2: 43%)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('40m (47m deco)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('46m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.57');
  expect.soft(await maintainDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect.soft(await maintainDepthPage.currentStats.getCurrentEND()).toBe('30m');

  await maintainDepthPage.setTimeAtDepth(20);
  expect.soft(await maintainDepthPage.getTotalDiveDuration()).toBe('61 min 24 sec');
  expect.soft(await maintainDepthPage.getNewNDL()).toBe('0 sec');
  expect.soft(await maintainDepthPage.getNewCeiling()).toBe('26m');

  let decoMilestones = await maintainDepthPage.getDecoMilestones();
  expect.soft(decoMilestones[0]).toBe('1 min 9 sec : Helitrox 25/25 @ 43m');
  expect.soft(decoMilestones[1]).toBe('6 min 55 sec : Helitrox 35/25 @ 35m');
  expect.soft(decoMilestones[2]).toBe('13 min 1 sec : Air @ 30m');
  expect.soft(decoMilestones[3]).toBe('13 min 1 sec : Nitrox 32 @ 30m');
  expect.soft(decoMilestones[4]).toBe('38 min 38 sec : Nitrox 50 @ 22m');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[8].heading).toBe('arrow_forward 41:24 Maintain Depth at 46m');
  expect.soft(diveSegments[8].details).toBe('Time: 20 min');
  expect.soft(diveSegments[9].heading).toBe('done 1:01:24 Surface');
  expect.soft(diveSegments[9].details).toBe('Ascent time: 4 min 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('66 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('71m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 23.5m for 2 min 33 sec');

  // add 9th segment
  changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect.soft(await changeDepthPage.currentStats.getCurrentDepth()).toBe('46m');
  expect.soft(await changeDepthPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('26m');
  expect.soft(await changeDepthPage.currentStats.getCurrentGas()).toBe('Custom (O2: 28%, He: 29%, N2: 43%)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('40m (47m deco)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('46m');
  expect.soft(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getCurrentPO2()).toBe('1.57');
  expect.soft(await changeDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect.soft(await changeDepthPage.currentStats.getCurrentEND()).toBe('30m');

  await changeDepthPage.setNewDepth(26);
  expect.soft(await changeDepthPage.getAscentTime()).toBe('2 min @ 10m/min');
  expect.soft(await changeDepthPage.getNewDepthPO2()).toBe('1.01');
  expect.soft(await changeDepthPage.getNewDepthEND()).toBe('16m');
  expect.soft(await changeDepthPage.getNewDepthNDL()).toBe('0 sec');
  expect.soft(await changeDepthPage.getNewDepthCeiling()).toBe('26m');

  diveOverviewPage = await changeDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[9].heading).toBe('arrow_upward 1:01:24 Ascend to 26m');
  expect.soft(diveSegments[9].details).toBe('Ascent time: 2 min @ 10m/min');
  expect.soft(diveSegments[10].heading).toBe('done 1:03:24 Surface');
  expect.soft(diveSegments[10].details).toBe('Ascent time: 2 min 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('66 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('71m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 23.5m for 2 min 33 sec');

  // add 10th segment
  changeGasPage = await diveOverviewPage.addChangeGasSegment();
  expect.soft(await changeGasPage.currentStats.getCurrentDepth()).toBe('26m');
  expect.soft(await changeGasPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeGasPage.currentStats.getCurrentCeiling()).toBe('26m');
  expect.soft(await changeGasPage.currentStats.getCurrentGas()).toBe('Custom (O2: 28%, He: 29%, N2: 43%)');
  expect.soft(await changeGasPage.currentStats.getCurrentMaxDepthPO2()).toBe('40m (47m deco)');
  expect.soft(await changeGasPage.currentStats.getCurrentMaxDepthEND()).toBe('46m');
  expect.soft(await changeGasPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await changeGasPage.currentStats.getCurrentPO2()).toBe('1.01');
  expect.soft(await changeGasPage.currentStats.isCurrentPO2Warning()).toBe(false);
  expect.soft(await changeGasPage.currentStats.getCurrentEND()).toBe('16m');

  expect.soft(await changeGasPage.getOptimalDecoGas()).toBe('Custom (O2: 44%, He: 0%, N2: 56%)');
  await changeGasPage.selectOptimalDecoGas();
  expect.soft(await changeGasPage.getNewGasPO2()).toBe('1.58');
  expect.soft(await changeGasPage.isNewGasPO2Warning()).toBe(true);
  expect.soft(await changeGasPage.getNewGasEND()).toBe('26m');
  expect.soft(await changeGasPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeGasPage.getNewGasMaxDepthPO2()).toBe('21m (26m deco)');
  expect.soft(await changeGasPage.getNewGasMaxDepthEND()).toBe('30m');
  expect.soft(await changeGasPage.getNewGasMinDepthHypoxia()).toBe('0m');

  diveOverviewPage = await changeGasPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[10].heading).toBe('air 1:03:24 Switch Gas');
  expect.soft(diveSegments[10].details).toBe('Custom (O2: 44%, He: 0%, N2: 56%)');
  expect.soft(diveSegments[11].heading).toBe('done 1:03:24 Surface');
  expect.soft(diveSegments[11].details).toBe('Ascent time: 2 min 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('66 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('71m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 23.2m for 2 min 33 sec');

  // add 11th segment
  maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect.soft(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('26m');
  expect.soft(await maintainDepthPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('26m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Custom (O2: 44%, He: 0%, N2: 56%)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('21m (26m deco)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.58');
  expect.soft(await maintainDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect.soft(await maintainDepthPage.currentStats.getCurrentEND()).toBe('26m');

  await maintainDepthPage.setTimeAtDepth(106);
  expect.soft(await maintainDepthPage.getTotalDiveDuration()).toBe('169 min 24 sec');
  expect.soft(await maintainDepthPage.getNewNDL()).toBe('0 sec');
  expect.soft(await maintainDepthPage.getNewCeiling()).toBe('6m');

  decoMilestones = await maintainDepthPage.getDecoMilestones();
  expect.soft(decoMilestones[0]).toBe('5 min 20 sec : Nitrox 50 @ 22m');
  expect.soft(decoMilestones[1]).toBe('106 min 56 sec : Oxygen @ 6m');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[11].heading).toBe('arrow_forward 1:03:24 Maintain Depth at 26m');
  expect.soft(diveSegments[11].details).toBe('Time: 106 min');
  expect.soft(diveSegments[12].heading).toBe('done 2:49:24 Surface');
  expect.soft(diveSegments[12].details).toBe('Ascent time: 2 min 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('172 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('43m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 5.7m for 35 sec');

  // add 12th segment
  changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect.soft(await changeDepthPage.currentStats.getCurrentDepth()).toBe('26m');
  expect.soft(await changeDepthPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('6m');
  expect.soft(await changeDepthPage.currentStats.getCurrentGas()).toBe('Custom (O2: 44%, He: 0%, N2: 56%)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('21m (26m deco)');
  expect.soft(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect.soft(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await changeDepthPage.currentStats.getCurrentPO2()).toBe('1.58');
  expect.soft(await changeDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect.soft(await changeDepthPage.currentStats.getCurrentEND()).toBe('26m');

  await changeDepthPage.setNewDepth(6);
  expect.soft(await changeDepthPage.getAscentTime()).toBe('2 min @ 10m/min');
  expect.soft(await changeDepthPage.getNewDepthPO2()).toBe('0.70');
  expect.soft(await changeDepthPage.getNewDepthEND()).toBe('6m');
  expect.soft(await changeDepthPage.getNewDepthNDL()).toBe('0 sec');
  expect.soft(await changeDepthPage.getNewDepthCeiling()).toBe('6m');

  diveOverviewPage = await changeDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[12].heading).toBe('arrow_upward 2:49:24 Ascend to 6m');
  expect.soft(diveSegments[12].details).toBe('Ascent time: 2 min @ 10m/min');
  expect.soft(diveSegments[13].heading).toBe('done 2:51:24 Surface');
  expect.soft(diveSegments[13].details).toBe('Ascent time: 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('172 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('43m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 5.7m for 35 sec');

  // add 13th segment
  changeGasPage = await diveOverviewPage.addChangeGasSegment();
  expect.soft(await changeGasPage.currentStats.getCurrentDepth()).toBe('6m');
  expect.soft(await changeGasPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeGasPage.currentStats.getCurrentCeiling()).toBe('6m');
  expect.soft(await changeGasPage.currentStats.getCurrentGas()).toBe('Custom (O2: 44%, He: 0%, N2: 56%)');
  expect.soft(await changeGasPage.currentStats.getCurrentMaxDepthPO2()).toBe('21m (26m deco)');
  expect.soft(await changeGasPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect.soft(await changeGasPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await changeGasPage.currentStats.getCurrentPO2()).toBe('0.70');
  expect.soft(await changeGasPage.currentStats.isCurrentPO2Warning()).toBe(false);
  expect.soft(await changeGasPage.currentStats.getCurrentEND()).toBe('6m');

  expect.soft(await changeGasPage.getOptimalDecoGas()).toBe('Oxygen (O2: 100%, He: 0%, N2: 0%)');
  await changeGasPage.selectCustomGas(100, 0);
  expect.soft(await changeGasPage.getNewGasPO2()).toBe('1.60');
  expect.soft(await changeGasPage.isNewGasPO2Warning()).toBe(true);
  expect.soft(await changeGasPage.getNewGasEND()).toBe('6m');
  expect.soft(await changeGasPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect.soft(await changeGasPage.getNewGasMaxDepthPO2()).toBe('4m (6m deco)');
  expect.soft(await changeGasPage.getNewGasMaxDepthEND()).toBe('30m');
  expect.soft(await changeGasPage.getNewGasMinDepthHypoxia()).toBe('0m');

  diveOverviewPage = await changeGasPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[13].heading).toBe('air 2:51:24 Switch Gas');
  expect.soft(diveSegments[13].details).toBe('Oxygen (O2: 100%, He: 0%, N2: 0%)');
  expect.soft(diveSegments[14].heading).toBe('done 2:51:24 Surface');
  expect.soft(diveSegments[14].details).toBe('Ascent time: 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('172 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('43m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors.length).toBe(1);
  expect.soft(diveErrors[0]).toBe('Exceeded ceiling by up to 5.7m for 35 sec');

  // add 14th segment
  maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect.soft(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('6m');
  expect.soft(await maintainDepthPage.currentStats.getNoDecoLimit()).toBe('0 sec');
  expect.soft(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('6m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Oxygen (O2: 100%, He: 0%, N2: 0%)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('4m (6m deco)');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect.soft(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.60');
  expect.soft(await maintainDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect.soft(await maintainDepthPage.currentStats.getCurrentEND()).toBe('6m');

  await maintainDepthPage.setTimeAtDepth(100);
  expect.soft(await maintainDepthPage.getTotalDiveDuration()).toBe('271 min 24 sec');
  expect.soft(await maintainDepthPage.getNewNDL()).toBe('> 5 hours');
  expect.soft(await maintainDepthPage.getNewCeiling()).toBe('0m');

  decoMilestones = await maintainDepthPage.getDecoMilestones();
  expect.soft(decoMilestones[0]).toBe('100 min 11 sec : Deco complete @ 0m');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect.soft(diveSegments[14].heading).toBe('arrow_forward 2:51:24 Maintain Depth at 6m');
  expect.soft(diveSegments[14].details).toBe('Time: 100 min');
  expect.soft(diveSegments[15].heading).toBe('done 4:31:24 Surface');
  expect.soft(diveSegments[15].details).toBe('Ascent time: 36 sec @ 10m/min');

  expect.soft(await diveOverviewPage.getDiveDuration()).toBe('272 min');
  expect.soft(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect.soft(await diveOverviewPage.getAverageDepth()).toBe('30m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect.soft(diveErrors).toHaveLength(0);
});
