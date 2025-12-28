'use client';

import React from 'react';
import { Box } from '@mui/material';
import DivePlan from '../components/DivePlan';
import DiveSummary from '../components/DiveSummary';
import ErrorList from '../components/ErrorList';
import DepthChart from '../components/DepthChart';
import PO2Chart from '../components/PO2Chart';
import ENDChart from '../components/ENDChart';
import TissuesCeilingChart from '../components/TissuesCeilingChart';
import TissuesPN2Chart from '../components/TissuesPN2Chart';
import TissuesPHeChart from '../components/TissuesPHeChart';

export default function DiveOverviewPage() {
  return (
    <Box component="main" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <DivePlan />
          <DiveSummary />
        </Box>
        <Box sx={{ flex: '2 1 600px' }}>
          <ErrorList />
          <DepthChart />
          <PO2Chart />
          <ENDChart />
          <TissuesCeilingChart />
          <TissuesPN2Chart />
          <TissuesPHeChart />
        </Box>
      </Box>
    </Box>
  );
}
