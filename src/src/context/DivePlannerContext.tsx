'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DivePlannerService } from '@/services/dive-planner-service/DivePlannerService';
import { BreathingGas } from '@/services/dive-planner-service/BreathingGas';

interface DivePlannerContextType {
  divePlanner: DivePlannerService;
  updateTrigger: number;
  triggerUpdate: () => void;
}

const DivePlannerContext = createContext<DivePlannerContextType | undefined>(undefined);

export function DivePlannerProvider({ children }: { children: ReactNode }) {
  const [divePlanner] = useState(() => new DivePlannerService());
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  return (
    <DivePlannerContext.Provider value={{ divePlanner, updateTrigger, triggerUpdate }}>
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

export { BreathingGas };
