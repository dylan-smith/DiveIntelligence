import { create } from 'zustand';
import { DivePlanner } from './DivePlanner';
import { DiveSettings } from './DiveSettings';
import { BreathingGas } from './BreathingGas';
import { trackEvent } from '../application-insights';

export interface DiveSettingsValues {
  ascentRate: number;
  descentRate: number;
  isOxygenNarcotic: boolean;
  workingPO2Maximum: number;
  decoPO2Maximum: number;
  pO2Minimum: number;
  ENDErrorThreshold: number;
}

interface DivePlannerStore {
  // version is a monotonic counter bumped on every mutation of the (deliberately
  // mutable) planner instance; it is the only value components subscribe to.
  version: number;
  planner: DivePlanner;
  startDive: (gas: BreathingGas) => void;
  addChangeDepthSegment: (newDepth: number) => void;
  addChangeGasSegment: (newGas: BreathingGas) => void;
  addMaintainDepthSegment: (timeAtDepth: number) => void;
  updateSettings: (patch: Partial<DiveSettingsValues>) => void;
}

export const useDivePlannerStore = create<DivePlannerStore>((set, get) => ({
  version: 0,
  planner: new DivePlanner(new DiveSettings(), trackEvent),
  startDive: gas => {
    get().planner.startDive(gas);
    set(s => ({ version: s.version + 1 }));
  },
  addChangeDepthSegment: newDepth => {
    get().planner.addChangeDepthSegment(newDepth);
    set(s => ({ version: s.version + 1 }));
  },
  addChangeGasSegment: newGas => {
    get().planner.addChangeGasSegment(newGas);
    set(s => ({ version: s.version + 1 }));
  },
  addMaintainDepthSegment: timeAtDepth => {
    get().planner.addMaintainDepthSegment(timeAtDepth);
    set(s => ({ version: s.version + 1 }));
  },
  updateSettings: patch => {
    Object.assign(get().planner.settings, patch);
    set(s => ({ version: s.version + 1 }));
  },
}));

// Subscribes the component to all planner mutations and returns the stable
// planner instance; call its getters during render for always-fresh values.
export function useDivePlanner(): DivePlanner {
  useDivePlannerStore(s => s.version);
  return useDivePlannerStore(s => s.planner);
}

export function useDivePlannerVersion(): number {
  return useDivePlannerStore(s => s.version);
}
