'use client';

import React from 'react';
import { Box, Tooltip, Typography, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner } from '../contexts/DivePlannerContext';

interface StartGasStatsProps {
  gas: BreathingGas;
}

export default function StartGasStats({ gas }: StartGasStatsProps) {
  const { divePlanner } = useDivePlanner();
  const settings = divePlanner.settings;

  const isMinDepthError = () => {
    return gas.minDepth > 0;
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tooltip title={settings.MaxDepthPO2Tooltip} placement="right">
          <Typography>
            Max Depth (PO<sub>2</sub>): <strong>{gas.maxDepthPO2}m ({gas.maxDepthPO2Deco}m deco)</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={settings.MaxDepthENDTooltip} placement="right">
          <Typography>
            Max Depth (END): <strong>{gas.maxDepthEND}m</strong>
          </Typography>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={settings.MinDepthTooltip} placement="bottom">
            <Typography>
              Min Depth (Hypoxia): <strong>{gas.minDepth}m</strong>
            </Typography>
          </Tooltip>
          {isMinDepthError() && (
            <Tooltip title="This gas cannot be breathed at the surface due to the hypoxic oxygen content">
              <ErrorIcon color="error" />
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
