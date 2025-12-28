'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { DiveSettingsService } from '../dive-planner-service/DiveSettings.service';
import { BreathingGas } from '../dive-planner-service/BreathingGas';

interface DivePlannerContextType {
  divePlanner: DivePlannerService;
  updateTrigger: number;
  forceUpdate: () => void;
}

const DivePlannerContext = createContext<DivePlannerContextType | undefined>(undefined);

export function DivePlannerProvider({ children }: { children: ReactNode }) {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  const divePlanner = useMemo(() => {
    const settings = new DiveSettingsService();
    return new DivePlannerService(settings);
  }, []);

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const value = useMemo(() => ({
    divePlanner,
    updateTrigger,
    forceUpdate,
  }), [divePlanner, updateTrigger, forceUpdate]);

  return (
    <DivePlannerContext.Provider value={value}>
      {children}
    </DivePlannerContext.Provider>
  );
}

export function useDivePlanner() {
  const context = useContext(DivePlannerContext);
  if (context === undefined) {
    throw new Error('useDivePlanner must be used within a DivePlannerProvider');
  }
  return context;
}

// Hook for starting a dive
export function useStartDive() {
  const { divePlanner, forceUpdate } = useDivePlanner();
  
  return useCallback((startGas: BreathingGas) => {
    divePlanner.startDive(startGas);
    forceUpdate();
  }, [divePlanner, forceUpdate]);
}

// Hook for adding a change depth segment
export function useAddChangeDepthSegment() {
  const { divePlanner, forceUpdate } = useDivePlanner();
  
  return useCallback((newDepth: number) => {
    divePlanner.addChangeDepthSegment(newDepth);
    forceUpdate();
  }, [divePlanner, forceUpdate]);
}

// Hook for adding a change gas segment
export function useAddChangeGasSegment() {
  const { divePlanner, forceUpdate } = useDivePlanner();
  
  return useCallback((newGas: BreathingGas) => {
    divePlanner.addChangeGasSegment(newGas);
    forceUpdate();
  }, [divePlanner, forceUpdate]);
}

// Hook for adding a maintain depth segment
export function useAddMaintainDepthSegment() {
  const { divePlanner, forceUpdate } = useDivePlanner();
  
  return useCallback((timeAtDepth: number) => {
    divePlanner.addMaintainDepthSegment(timeAtDepth);
    forceUpdate();
  }, [divePlanner, forceUpdate]);
}
