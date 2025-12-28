'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { DivePlannerService } from './dive-planner/DivePlannerService';
import { DiveSettingsService } from './dive-planner/DiveSettings.service';
import { DiveSegmentFactoryService } from './dive-planner/DiveSegmentFactory.service';
import { ChartGeneratorService } from './dive-planner/ChartGenerator.service';
import { ApplicationInsightsService } from './application-insights';

interface DivePlannerContextType {
  divePlanner: DivePlannerService;
}

const DivePlannerContext = createContext<DivePlannerContextType | undefined>(undefined);

export function DivePlannerProvider({ children }: { children: ReactNode }) {
  const divePlanner = useMemo(() => {
    const settings = new DiveSettingsService();
    const segmentFactory = new DiveSegmentFactoryService(settings);
    const chartGenerator = new ChartGeneratorService(segmentFactory, settings);
    const appInsights = new ApplicationInsightsService(process.env.NEXT_PUBLIC_APPINSIGHTS_KEY);
    return new DivePlannerService(segmentFactory, appInsights, chartGenerator, settings);
  }, []);

  return (
    <DivePlannerContext.Provider value={{ divePlanner }}>
      {children}
    </DivePlannerContext.Provider>
  );
}

export function useDivePlanner() {
  const context = useContext(DivePlannerContext);
  if (context === undefined) {
    throw new Error('useDivePlanner must be used within a DivePlannerProvider');
  }
  return context.divePlanner;
}
