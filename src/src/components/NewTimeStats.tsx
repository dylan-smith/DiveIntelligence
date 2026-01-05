'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { useDivePlanner } from '@/context/DivePlannerContext';
import { humanDuration } from '@/utils/format';

interface NewTimeStatsProps {
  timeAtDepth: number;
}

export default function NewTimeStats({ timeAtDepth }: NewTimeStatsProps) {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const currentDepth = divePlanner.getCurrentDepth();
  const currentGas = divePlanner.getCurrentGas();
  const currentDiveTime = divePlanner.getCurrentDiveTime();
  const timeAtDepthSeconds = timeAtDepth * 60;
  
  const totalDiveDuration = currentDiveTime + timeAtDepthSeconds;
  
  const ndl = divePlanner.getNoDecoLimit(currentDepth, currentGas, timeAtDepthSeconds);
  const newNDL = ndl === undefined ? '> 5 hours' : humanDuration(ndl);
  
  const newCeiling = divePlanner.getNewCeiling(currentDepth, timeAtDepthSeconds);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Time at Depth Statistics
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography>
          Total Dive Duration:{' '}
          <strong>{humanDuration(totalDiveDuration)}</strong>
        </Typography>
        <Tooltip
          title="Remaining no decompression limit after this time at depth"
          placement="right"
        >
          <Typography>
            NDL: <strong>{newNDL}</strong>
          </Typography>
        </Tooltip>
        <Tooltip
          title="Ceiling after staying at depth for this time"
          placement="right"
        >
          <Typography>
            Ceiling: <strong>{newCeiling}m</strong>
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
}
