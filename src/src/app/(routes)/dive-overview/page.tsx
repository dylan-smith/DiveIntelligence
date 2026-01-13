'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import DivePlan from '@/components/DivePlan';
import DiveSummary from '@/components/DiveSummary';
import ErrorList from '@/components/ErrorList';
import DepthChart from '@/components/charts/DepthChart';
import PO2Chart from '@/components/charts/PO2Chart';
import ENDChart from '@/components/charts/ENDChart';
import TissuesCeilingChart from '@/components/charts/TissuesCeilingChart';
import TissuesPN2Chart from '@/components/charts/TissuesPN2Chart';
import TissuesPHeChart from '@/components/charts/TissuesPHeChart';
import { useDivePlanner } from '@/context/DivePlannerContext';

export default function DiveOverviewPage() {
  const router = useRouter();
  const { divePlanner } = useDivePlanner();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (divePlanner.getDiveSegments().length > 0) {
      setIsReady(true);
    } else {
      router.push('/');
    }
  }, [divePlanner, router]);

  if (!isReady) {
    return null;
  }

  return (
    <Box component="main" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <DivePlan />
        <DiveSummary />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ErrorList />
        <DepthChart />
        <PO2Chart />
        <ENDChart />
        <TissuesCeilingChart />
        <TissuesPN2Chart />
        <TissuesPHeChart />
      </Box>
    </Box>
  );
}
