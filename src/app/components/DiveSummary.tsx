'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useDivePlanner } from '../contexts/DivePlannerContext';
import { humanDuration } from '../utility/formatters';

export default function DiveSummary() {
  const { divePlanner, updateTrigger } = useDivePlanner();

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Typography>
          Dive Duration: <strong>{humanDuration(divePlanner.getDiveDuration())}</strong>
        </Typography>
        <Typography>
          Max Depth: <strong>{divePlanner.getMaxDepth()}m</strong>
        </Typography>
        <Typography>
          Average Depth: <strong>{Math.round(divePlanner.getAverageDepth())}m</strong>
        </Typography>
      </Box>
    </Paper>
  );
}
