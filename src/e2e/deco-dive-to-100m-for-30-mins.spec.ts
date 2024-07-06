import { test, expect } from 'e2e/_shared/app-fixtures';
import { HomePage } from './pages/home.page';

test('deco dive to 100m for 30 mins', async ({ page }) => {
  const homePage = await new HomePage(page).goto();

  const newDivePage = await homePage.planADive();

  await newDivePage.selectStandardGas('Nitrox 50');
  expect(await newDivePage.getMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await newDivePage.getMaxDepthEND()).toBe('30m');
  expect(await newDivePage.getMinDepthHypoxia()).toBe('0m');

  let diveOverviewPage = await newDivePage.Save();

  // add 1st segment
  let changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect(await changeDepthPage.currentStats.getCurrentDepth()).toBe('0m');
  expect(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect(await changeDepthPage.currentStats.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await changeDepthPage.currentStats.getCurrentPO2()).toBe('0.50');
  expect(await changeDepthPage.currentStats.getCurrentEND()).toBe('0m');

  await changeDepthPage.setNewDepth(18);
  expect(await changeDepthPage.getDescentTime()).toBe('54 sec @ 20m/min');
  expect(await changeDepthPage.getNewDepthPO2()).toBe('1.40');
  expect(await changeDepthPage.getNewDepthEND()).toBe('18m');

  diveOverviewPage = await changeDepthPage.Save();

  let diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect(diveSegments[0].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 18m');
  expect(diveSegments[1].details).toBe('Descent time: 54 sec @ 20m/min');
  expect(diveSegments[2].heading).toBe('done 0:54 Surface');
  expect(diveSegments[2].details).toBe('Ascent time: 1 min 48 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('2 min 42 sec');
  expect(await diveOverviewPage.getMaxDepth()).toBe('18m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('9m');

  let diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(0);

  // add 2nd segment
  let changeGasPage = await diveOverviewPage.addChangeGasSegment();
  expect(await changeGasPage.currentStats.getCurrentDepth()).toBe('18m');
  expect(await changeGasPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect(await changeGasPage.currentStats.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(await changeGasPage.currentStats.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await changeGasPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect(await changeGasPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await changeGasPage.currentStats.getCurrentPO2()).toBe('1.40');
  expect(await changeGasPage.currentStats.getCurrentEND()).toBe('18m');

  await changeGasPage.selectStandardGas('Trimix 10/70');
  expect(await changeGasPage.getNewGasPO2()).toBe('0.28');
  expect(await changeGasPage.getNewGasEND()).toBe('0m');
  expect(await changeGasPage.getNewGasNoDecoLimit()).toBe('44 min 44 sec');
  expect(await changeGasPage.getNewGasMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await changeGasPage.getNewGasMaxDepthEND()).toBe('123m');
  expect(await changeGasPage.getNewGasMinDepthHypoxia()).toBe('8m');

  diveOverviewPage = await changeGasPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect(diveSegments[0].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 18m');
  expect(diveSegments[1].details).toBe('Descent time: 54 sec @ 20m/min');
  expect(diveSegments[2].heading).toBe('air 0:54 Switch Gas');
  expect(diveSegments[2].details).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(diveSegments[3].heading).toBe('done 0:54 Surface');
  expect(diveSegments[3].details).toBe('Ascent time: 1 min 48 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('2 min 42 sec');
  expect(await diveOverviewPage.getMaxDepth()).toBe('18m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('9m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 3rd segment
  let maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('18m');
  expect(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('0.28');
  expect(await maintainDepthPage.currentStats.getCurrentEND()).toBe('0m');

  await maintainDepthPage.setTimeAtDepth(1);
  expect(await maintainDepthPage.getFinalCeiling()).toBe('0m');
  expect(await maintainDepthPage.getTotalDiveDuration()).toBe('1 min 54 sec');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[0].heading).toBe('scuba_diving 0:00 Start Dive');
  expect(diveSegments[0].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(diveSegments[1].heading).toBe('arrow_downward 0:00 Descend to 18m');
  expect(diveSegments[1].details).toBe('Descent time: 54 sec @ 20m/min');
  expect(diveSegments[2].heading).toBe('air 0:54 Switch Gas');
  expect(diveSegments[2].details).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(diveSegments[3].heading).toBe('arrow_forward 0:54 Maintain Depth at 18m');
  expect(diveSegments[3].details).toBe('Time: 1 min');
  expect(diveSegments[4].heading).toBe('done 1:54 Surface');
  expect(diveSegments[4].details).toBe('Ascent time: 1 min 48 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('3 min 42 sec');
  expect(await diveOverviewPage.getMaxDepth()).toBe('18m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('11m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 4th segment
  changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect(await changeDepthPage.currentStats.getCurrentDepth()).toBe('18m');
  expect(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('0m');
  expect(await changeDepthPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect(await changeDepthPage.currentStats.getCurrentPO2()).toBe('0.28');
  expect(await changeDepthPage.currentStats.getCurrentEND()).toBe('0m');

  await changeDepthPage.setNewDepth(100);
  expect(await changeDepthPage.getDescentTime()).toBe('4 min 6 sec @ 20m/min');
  expect(await changeDepthPage.getNewDepthPO2()).toBe('1.10');
  expect(await changeDepthPage.getNewDepthEND()).toBe('23m');

  diveOverviewPage = await changeDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[4].heading).toBe('arrow_downward 1:54 Descend to 100m');
  expect(diveSegments[4].details).toBe('Descent time: 4 min 6 sec @ 20m/min');
  expect(diveSegments[5].heading).toBe('done 6:00 Surface');
  expect(diveSegments[5].details).toBe('Ascent time: 10 min @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('16 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('48m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(2);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 7.9m for 57 sec');
  expect(diveErrors[1]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 5th segment
  maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('100m');
  expect(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('8m');
  expect(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.10');
  expect(await maintainDepthPage.currentStats.getCurrentEND()).toBe('23m');

  await maintainDepthPage.setTimeAtDepth(30);
  expect(await maintainDepthPage.getFinalCeiling()).toBe('49m');
  expect(await maintainDepthPage.getTotalDiveDuration()).toBe('36 min');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[5].heading).toBe('arrow_forward 6:00 Maintain Depth at 100m');
  expect(diveSegments[5].details).toBe('Time: 30 min');
  expect(diveSegments[6].heading).toBe('done 36:00 Surface');
  expect(diveSegments[6].details).toBe('Ascent time: 10 min @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('46 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('82m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(2);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 34.2m for 4 min 17 sec');
  expect(diveErrors[1]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 6th segment
  changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect(await changeDepthPage.currentStats.getCurrentDepth()).toBe('100m');
  expect(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('49m');
  expect(await changeDepthPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect(await changeDepthPage.currentStats.getCurrentPO2()).toBe('1.10');
  expect(await changeDepthPage.currentStats.getCurrentEND()).toBe('23m');

  await changeDepthPage.setNewDepth(43);
  expect(await changeDepthPage.getAscentTime()).toBe('5 min 42 sec @ 10m/min');
  expect(await changeDepthPage.getNewDepthPO2()).toBe('0.53');
  expect(await changeDepthPage.getNewDepthEND()).toBe('6m');

  diveOverviewPage = await changeDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[6].heading).toBe('arrow_upward 36:00 Ascend to 43m');
  expect(diveSegments[6].details).toBe('Ascent time: 5 min 42 sec @ 10m/min');
  expect(diveSegments[7].heading).toBe('done 41:42 Surface');
  expect(diveSegments[7].details).toBe('Ascent time: 4 min 18 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('46 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('82m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(2);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 34.2m for 4 min 17 sec');
  expect(diveErrors[1]).toBe('Hypoxic gas as low as 0.102 for 47 sec');

  // add 7th segment
  changeGasPage = await diveOverviewPage.addChangeGasSegment();
  expect(await changeGasPage.currentStats.getCurrentDepth()).toBe('43m');
  expect(await changeGasPage.currentStats.getCurrentCeiling()).toBe('43m');
  expect(await changeGasPage.currentStats.getCurrentGas()).toBe('Trimix 10/70 (O2: 10%, He: 70%, N2: 20%)');
  expect(await changeGasPage.currentStats.getCurrentMaxDepthPO2()).toBe('130m (150m deco)');
  expect(await changeGasPage.currentStats.getCurrentMaxDepthEND()).toBe('123m');
  expect(await changeGasPage.currentStats.getCurrentMinDepthHypoxia()).toBe('8m');
  expect(await changeGasPage.currentStats.getCurrentPO2()).toBe('0.53');
  expect(await changeGasPage.currentStats.getCurrentEND()).toBe('6m');

  expect(await changeGasPage.getOptimalDecoGas()).toBe('Custom (O2: 30%, He: 25%, N2: 45%)');
  await changeGasPage.selectOptimalDecoGas();
  expect(await changeGasPage.getNewGasPO2()).toBe('1.59');
  expect(await changeGasPage.isNewGasPO2Warning()).toBe(true);
  expect(await changeGasPage.getNewGasEND()).toBe('30m');
  expect(await changeGasPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect(await changeGasPage.getNewGasMaxDepthPO2()).toBe('36m (43m deco)');
  expect(await changeGasPage.getNewGasMaxDepthEND()).toBe('43m');
  expect(await changeGasPage.getNewGasMinDepthHypoxia()).toBe('0m');

  diveOverviewPage = await changeGasPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[7].heading).toBe('air 41:42 Switch Gas');
  expect(diveSegments[7].details).toBe('Custom (O2: 30%, He: 25%, N2: 45%)');
  expect(diveSegments[8].heading).toBe('done 41:42 Surface');
  expect(diveSegments[8].details).toBe('Ascent time: 4 min 18 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('46 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('82m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 32.7m for 4 min 16 sec');

  // add 8th segment
  maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('43m');
  expect(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('43m');
  expect(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Custom (O2: 30%, He: 25%, N2: 45%)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('36m (43m deco)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('43m');
  expect(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.59');
  expect(await maintainDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect(await maintainDepthPage.currentStats.getCurrentEND()).toBe('30m');

  await maintainDepthPage.setTimeAtDepth(20);
  expect(await maintainDepthPage.getFinalCeiling()).toBe('23m');
  expect(await maintainDepthPage.getTotalDiveDuration()).toBe('61 min 42 sec');

  let decoMilestones = await maintainDepthPage.getDecoMilestones();
  expect(decoMilestones[0]).toBe('3 min 45 sec : Helitrox 35/25 @ 35m');
  expect(decoMilestones[1]).toBe('8 min 8 sec : Air @ 30m');
  expect(decoMilestones[2]).toBe('8 min 8 sec : Nitrox 32 @ 30m');
  expect(decoMilestones[3]).toBe('20 min 25 sec : Nitrox 50 @ 22m');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[8].heading).toBe('arrow_forward 41:42 Maintain Depth at 43m');
  expect(diveSegments[8].details).toBe('Time: 20 min');
  expect(diveSegments[9].heading).toBe('done 1:01:42 Surface');
  expect(diveSegments[9].details).toBe('Ascent time: 4 min 18 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('66 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('70m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 19.3m for 2 min 6 sec');

  // add 9th segment
  changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect(await changeDepthPage.currentStats.getCurrentDepth()).toBe('43m');
  expect(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('23m');
  expect(await changeDepthPage.currentStats.getCurrentGas()).toBe('Custom (O2: 30%, He: 25%, N2: 45%)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('36m (43m deco)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('43m');
  expect(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await changeDepthPage.currentStats.getCurrentPO2()).toBe('1.59');
  expect(await changeDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect(await changeDepthPage.currentStats.getCurrentEND()).toBe('30m');

  await changeDepthPage.setNewDepth(22);
  expect(await changeDepthPage.getAscentTime()).toBe('2 min 6 sec @ 10m/min');
  expect(await changeDepthPage.getNewDepthPO2()).toBe('0.96');
  expect(await changeDepthPage.getNewDepthEND()).toBe('14m');

  diveOverviewPage = await changeDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[9].heading).toBe('arrow_upward 1:01:42 Ascend to 22m');
  expect(diveSegments[9].details).toBe('Ascent time: 2 min 6 sec @ 10m/min');
  expect(diveSegments[10].heading).toBe('done 1:03:48 Surface');
  expect(diveSegments[10].details).toBe('Ascent time: 2 min 12 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('66 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('70m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 19.3m for 2 min 6 sec');

  // add 10th segment
  changeGasPage = await diveOverviewPage.addChangeGasSegment();
  expect(await changeGasPage.currentStats.getCurrentDepth()).toBe('22m');
  expect(await changeGasPage.currentStats.getCurrentCeiling()).toBe('22m');
  expect(await changeGasPage.currentStats.getCurrentGas()).toBe('Custom (O2: 30%, He: 25%, N2: 45%)');
  expect(await changeGasPage.currentStats.getCurrentMaxDepthPO2()).toBe('36m (43m deco)');
  expect(await changeGasPage.currentStats.getCurrentMaxDepthEND()).toBe('43m');
  expect(await changeGasPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await changeGasPage.currentStats.getCurrentPO2()).toBe('0.96');
  expect(await changeGasPage.currentStats.isCurrentPO2Warning()).toBe(false);
  expect(await changeGasPage.currentStats.getCurrentEND()).toBe('14m');

  expect(await changeGasPage.getOptimalDecoGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  await changeGasPage.selectOptimalDecoGas();
  expect(await changeGasPage.getNewGasPO2()).toBe('1.60');
  expect(await changeGasPage.isNewGasPO2Warning()).toBe(true);
  expect(await changeGasPage.getNewGasEND()).toBe('22m');
  expect(await changeGasPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect(await changeGasPage.getNewGasMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await changeGasPage.getNewGasMaxDepthEND()).toBe('30m');
  expect(await changeGasPage.getNewGasMinDepthHypoxia()).toBe('0m');

  diveOverviewPage = await changeGasPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[10].heading).toBe('air 1:03:48 Switch Gas');
  expect(diveSegments[10].details).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(diveSegments[11].heading).toBe('done 1:03:48 Surface');
  expect(diveSegments[11].details).toBe('Ascent time: 2 min 12 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('66 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('70m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 19.0m for 2 min 5 sec');

  // add 11th segment
  maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('22m');
  expect(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('22m');
  expect(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.60');
  expect(await maintainDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect(await maintainDepthPage.currentStats.getCurrentEND()).toBe('22m');

  await maintainDepthPage.setTimeAtDepth(41);
  expect(await maintainDepthPage.getFinalCeiling()).toBe('7m');
  expect(await maintainDepthPage.getTotalDiveDuration()).toBe('104 min 48 sec');

  decoMilestones = await maintainDepthPage.getDecoMilestones();
  expect(decoMilestones[0]).toBe('41 min 39 sec : Oxygen @ 6m');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[11].heading).toBe('arrow_forward 1:03:48 Maintain Depth at 22m');
  expect(diveSegments[11].details).toBe('Time: 41 min');
  expect(diveSegments[12].heading).toBe('done 1:44:48 Surface');
  expect(diveSegments[12].details).toBe('Ascent time: 2 min 12 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('107 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('52m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 5.5m for 34 sec');

  // add 12th segment
  changeDepthPage = await diveOverviewPage.addChangeDepthSegment();
  expect(await changeDepthPage.currentStats.getCurrentDepth()).toBe('22m');
  expect(await changeDepthPage.currentStats.getCurrentCeiling()).toBe('7m');
  expect(await changeDepthPage.currentStats.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await changeDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect(await changeDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await changeDepthPage.currentStats.getCurrentPO2()).toBe('1.60');
  expect(await changeDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect(await changeDepthPage.currentStats.getCurrentEND()).toBe('22m');

  await changeDepthPage.setNewDepth(6);
  expect(await changeDepthPage.getAscentTime()).toBe('1 min 36 sec @ 10m/min');
  expect(await changeDepthPage.getNewDepthPO2()).toBe('0.80');
  expect(await changeDepthPage.getNewDepthEND()).toBe('6m');

  diveOverviewPage = await changeDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[12].heading).toBe('arrow_upward 1:44:48 Ascend to 6m');
  expect(diveSegments[12].details).toBe('Ascent time: 1 min 36 sec @ 10m/min');
  expect(diveSegments[13].heading).toBe('done 1:46:24 Surface');
  expect(diveSegments[13].details).toBe('Ascent time: 36 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('107 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('52m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 5.5m for 34 sec');

  // add 13th segment
  changeGasPage = await diveOverviewPage.addChangeGasSegment();
  expect(await changeGasPage.currentStats.getCurrentDepth()).toBe('6m');
  expect(await changeGasPage.currentStats.getCurrentCeiling()).toBe('6m');
  expect(await changeGasPage.currentStats.getCurrentGas()).toBe('Nitrox 50 (O2: 50%, He: 0%, N2: 50%)');
  expect(await changeGasPage.currentStats.getCurrentMaxDepthPO2()).toBe('18m (22m deco)');
  expect(await changeGasPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect(await changeGasPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await changeGasPage.currentStats.getCurrentPO2()).toBe('0.80');
  expect(await changeGasPage.currentStats.isCurrentPO2Warning()).toBe(false);
  expect(await changeGasPage.currentStats.getCurrentEND()).toBe('6m');

  expect(await changeGasPage.getOptimalDecoGas()).toBe('Oxygen (O2: 100%, He: 0%, N2: 0%)');
  await changeGasPage.selectCustomGas(100, 0);
  expect(await changeGasPage.getNewGasPO2()).toBe('1.60');
  expect(await changeGasPage.isNewGasPO2Warning()).toBe(true);
  expect(await changeGasPage.getNewGasEND()).toBe('6m');
  expect(await changeGasPage.getNewGasNoDecoLimit()).toBe('0 sec');
  expect(await changeGasPage.getNewGasMaxDepthPO2()).toBe('4m (6m deco)');
  expect(await changeGasPage.getNewGasMaxDepthEND()).toBe('30m');
  expect(await changeGasPage.getNewGasMinDepthHypoxia()).toBe('0m');

  diveOverviewPage = await changeGasPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[13].heading).toBe('air 1:46:24 Switch Gas');
  expect(diveSegments[13].details).toBe('Oxygen (O2: 100%, He: 0%, N2: 0%)');
  expect(diveSegments[14].heading).toBe('done 1:46:24 Surface');
  expect(diveSegments[14].details).toBe('Ascent time: 36 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('107 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('52m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors.length).toBe(1);
  expect(diveErrors[0]).toBe('Exceeded ceiling by up to 5.5m for 34 sec');

  // add 14th segment
  maintainDepthPage = await diveOverviewPage.addMaintainDepthSegment();
  expect(await maintainDepthPage.currentStats.getCurrentDepth()).toBe('6m');
  expect(await maintainDepthPage.currentStats.getCurrentCeiling()).toBe('6m');
  expect(await maintainDepthPage.currentStats.getCurrentGas()).toBe('Oxygen (O2: 100%, He: 0%, N2: 0%)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthPO2()).toBe('4m (6m deco)');
  expect(await maintainDepthPage.currentStats.getCurrentMaxDepthEND()).toBe('30m');
  expect(await maintainDepthPage.currentStats.getCurrentMinDepthHypoxia()).toBe('0m');
  expect(await maintainDepthPage.currentStats.getCurrentPO2()).toBe('1.60');
  expect(await maintainDepthPage.currentStats.isCurrentPO2Warning()).toBe(true);
  expect(await maintainDepthPage.currentStats.getCurrentEND()).toBe('6m');

  await maintainDepthPage.setTimeAtDepth(33);
  expect(await maintainDepthPage.getFinalCeiling()).toBe('1m');
  expect(await maintainDepthPage.getTotalDiveDuration()).toBe('139 min 24 sec');

  decoMilestones = await maintainDepthPage.getDecoMilestones();
  expect(decoMilestones[0]).toBe('33 min 3 sec : Deco complete @ 0m');

  diveOverviewPage = await maintainDepthPage.Save();

  diveSegments = await diveOverviewPage.getDiveSegments();
  expect(diveSegments[14].heading).toBe('arrow_forward 1:46:24 Maintain Depth at 6m');
  expect(diveSegments[14].details).toBe('Time: 33 min');
  expect(diveSegments[15].heading).toBe('done 2:19:24 Surface');
  expect(diveSegments[15].details).toBe('Ascent time: 36 sec @ 10m/min');

  expect(await diveOverviewPage.getDiveDuration()).toBe('140 min');
  expect(await diveOverviewPage.getMaxDepth()).toBe('100m');
  expect(await diveOverviewPage.getAverageDepth()).toBe('41m');

  diveErrors = await diveOverviewPage.getDiveErrors();
  expect(diveErrors).toHaveLength(0);
});
