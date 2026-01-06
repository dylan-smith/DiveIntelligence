'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { BreathingGas } from '@/services/dive-planner-service/BreathingGas';
import { useDivePlanner } from '@/context/DivePlannerContext';

interface StartGasStatsProps {
  gas: BreathingGas;
}

export default function StartGasStats({ gas }: StartGasStatsProps) {
  const { divePlanner } = useDivePlanner();
  const settings = divePlanner.settings;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Gas Statistics
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tooltip title={settings.MaxDepthPO2Tooltip} placement="right">
          <Typography>
            Max Depth (PO<sub>2</sub>):{' '}
            <strong>{gas.maxDepthPO2}m ({gas.maxDepthPO2Deco}m deco)</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={settings.MaxDepthENDTooltip} placement="right">
          <Typography>
            Max Depth (END): <strong>{gas.maxDepthEND}m</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={settings.MinDepthTooltip} placement="right">
          <Typography>
            Min Depth (Hypoxia): <strong>{gas.minDepth}m</strong>
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
}
