'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useDivePlanner } from '@/context/DivePlannerContext';
import { humanDuration } from '@/utils/format';

export default function DiveSummary() {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const diveDuration = divePlanner.getDiveDuration();
  const maxDepth = divePlanner.getMaxDepth();
  const averageDepth = Math.round(divePlanner.getAverageDepth());

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dive Summary
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography>
          Dive Duration: <strong>{humanDuration(diveDuration)}</strong>
        </Typography>
        <Typography>
          Max Depth: <strong>{maxDepth}m</strong>
        </Typography>
        <Typography>
          Average Depth: <strong>{averageDepth}m</strong>
        </Typography>
      </Box>
    </Paper>
  );
}
